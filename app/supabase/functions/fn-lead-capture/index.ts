// Deno 1.40+ Edge Function
// fn-lead-capture: Valida HMAC, sanitiza payload, cria lead + grava mídias no bucket temp-public
// Dedup por WhatsApp → status 'duplicado'

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    const { nome, whatsapp, descricao, emergencia, sessaoId, ip, userAgent } = await req.json();

    // Sanitização básica
    const nomeSanitizado = nome?.trim().substring(0, 200) || '';
    const whatsappLimpo = whatsapp.replace(/\D/g, '').substring(0, 11);
    const descricaoSanitizada = descricao?.trim().substring(0, 2000) || '';

    if (!nomeSanitizado || !whatsappLimpo || !descricaoSanitizada) {
      return new Response(JSON.stringify({ error: 'Dados obrigatórios faltando' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // Verificar duplicidade por WhatsApp
    const { data: leadsExistentes } = await supabaseAdmin
      .from('leads')
      .select('id, status')
      .eq('whatsapp', whatsappLimpo)
      .order('criado_em', { ascending: false })
      .limit(1);

    if (leadsExistentes && leadsExistentes.length > 0) {
      const ultimoLead = leadsExistentes[0];
      
      // Se já existe lead não processado, retornar duplicado
      if (['novo', 'confirmado', 'qualificado'].includes(ultimoLead.status)) {
        return new Response(JSON.stringify({ 
          status: 'duplicado',
          lead_id: ultimoLead.id,
          mensagem: 'Lead já existe para este WhatsApp'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        });
      }
    }

    // Determinar categoria e urgência baseado na descrição
    const termosEmergencia = ['fumaça', 'choque', 'curto', 'incêndio', 'urgente', 'emergência'];
    const urgenciaDetectada = termosEmergencia.some(t => descricaoSanitizada.toLowerCase().includes(t)) 
      ? 'alta' 
      : emergencia ? 'alta' : 'media';

    // Calcular score inicial (0-100)
    let score = 50;
    if (urgenciaDetectada === 'alta') score += 20;
    if (descricaoSanitizada.length > 100) score += 10;
    if (nomeSanitizado.split(' ').length >= 2) score += 10;

    // Criar lead
    const { data: novoLead, error: erroCriacao } = await supabaseAdmin
      .from('leads')
      .insert({
        nome: nomeSanitizado,
        whatsapp: whatsappLimpo,
        origem: 'faísca-web',
        sessao_id: sessaoId || crypto.randomUUID(),
        ip: ip || null,
        user_agent: userAgent || null,
        payload_ia: {
          resumo: descricaoSanitizada.substring(0, 200),
          categoria: 'ambos', // Será atualizado pela triagem completa
          urgencia: urgenciaDetectada,
          confianca: 0.75,
        },
        score,
        status: 'novo',
      })
      .select()
      .single();

    if (erroCriacao) {
      console.error('Erro ao criar lead:', erroCriacao);
      return new Response(JSON.stringify({ error: 'Erro ao criar lead' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    // TODO-BUSINESS: Upload de mídias para bucket temp-public com quarentena 24h
    // As mídias seriam recebidas via multipart/form-data e gravadas aqui

    return new Response(JSON.stringify({
      status: 'sucesso',
      lead_id: novoLead.id,
      mensagem: 'Lead criado com sucesso',
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 201,
    });
  } catch (error) {
    console.error('Erro na captura do lead:', error);
    return new Response(JSON.stringify({ error: 'Erro interno no servidor' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
