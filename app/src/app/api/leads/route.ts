import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Cliente Supabase com permissão para inserção de leads do formulário público
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nome, whatsapp, descricao, emergencia, midiasCount } = body;

    if (!nome || !whatsapp || !descricao) {
      return NextResponse.json(
        { error: 'Nome, WhatsApp e Descrição são obrigatórios' },
        { status: 400 }
      );
    }

    const whatsappLimpo = whatsapp.replace(/\D/g, '');

    // 1. Criar ou buscar cliente
    let clienteId: string | null = null;
    const { data: clienteExistente } = await supabaseAdmin
      .from('clientes')
      .select('id')
      .eq('whatsapp', whatsappLimpo)
      .maybeSingle();

    if (clienteExistente) {
      clienteId = clienteExistente.id;
    } else {
      const { data: novoCliente } = await supabaseAdmin
        .from('clientes')
        .insert({
          nome: nome.trim(),
          whatsapp: whatsappLimpo,
          tipo: 'industrial',
          observacoes: 'Capturado via Faísca PWA',
        })
        .select('id')
        .single();

      if (novoCliente) {
        clienteId = novoCliente.id;
      }
    }

    // 2. Criar lead
    const payloadIa = {
      resumo: descricao.trim(),
      categoria: 'industrial',
      urgencia: emergencia ? 'alta' : 'media',
      confianca: 0.95,
      qtd_midias: midiasCount || 0,
    };

    const { data: leadCriado, error: leadError } = await supabaseAdmin
      .from('leads')
      .insert({
        nome: nome.trim(),
        whatsapp: whatsappLimpo,
        origem: 'faisca_pwa',
        cliente_id: clienteId,
        payload_ia: payloadIa,
        score: emergencia ? 95 : 75,
        status: 'novo',
      })
      .select('*')
      .single();

    if (leadError) {
      console.error('Erro no Supabase ao criar lead:', leadError);
      return NextResponse.json({ error: leadError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, lead: leadCriado });
  } catch (error: unknown) {
    console.error('Erro ao processar captura de lead:', error);
    return NextResponse.json(
      { error: 'Erro interno ao processar a solicitação' },
      { status: 500 }
    );
  }
}
