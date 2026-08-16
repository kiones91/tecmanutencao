// Deno 1.40+ Edge Function
// fn-ia-triage: Processa áudio (Whisper) e imagem/vídeo (visão computacional)
// Retorna: { resumo, categoria, urgencia, confianca, midias[] }

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
    const { descricao, midiasMeta } = await req.json();
    
    // TODO-BUSINESS: Implementar integração real com OpenAI Whisper e Vision API
    // Por enquanto, mock baseado em análise de texto simples
    
    // Análise de emergência baseada em palavras-chave
    const termosEmergencia = [
      'fumaça', 'choque', 'curto', 'curto-circuito', 'faísca', 
      'incêndio', 'explosão', 'urgente', 'emergência', 'parada',
      'máquina parada', 'produção parada'
    ];
    
    const termosIndustria = [
      'inversor', 'clp', 'ihm', 'servomotor', 'painel', 'comando',
      'automação', 'máquina', 'equipamento industrial', 'motor trifásico'
    ];
    
    const termosPredial = [
      'ar condicionado', 'split', 'chiller', 'bombas', 'hidráulica',
      'quadro de força', 'iluminação', 'tomada', 'disjuntor', 'predial'
    ];
    
    const textoLower = descricao.toLowerCase();
    
    // Calcular urgência
    const emergenciaCount = termosEmergencia.filter(t => textoLower.includes(t)).length;
    const urgencia = emergenciaCount >= 2 ? 'alta' : emergenciaCount >= 1 ? 'media' : 'baixa';
    
    // Calcular categoria
    const industriaCount = termosIndustria.filter(t => textoLower.includes(t)).length;
    const predialCount = termosPredial.filter(t => textoLower.includes(t)).length;
    const categoria = industriaCount > predialCount ? 'industrial' : predialCount > industriaCount ? 'predial' : 'ambos';
    
    // Calcular confiança (mock - na implementação real viria da IA)
    const confianca = Math.min(0.95, 0.6 + (emergenciaCount * 0.1) + (industriaCount * 0.05) + (predialCount * 0.05));
    
    // Gerar resumo
    const resumo = `Solicitação de atendimento ${categoria} com urgência ${urgencia}. ${
      emergenciaCount > 0 ? 'Possíveis termos de emergência detectados.' : ''
    } Cliente descreveu: "${descricao.substring(0, 100)}${descricao.length > 100 ? '...' : ''}"`;
    
    const response = {
      resumo,
      categoria,
      urgencia,
      confianca: parseFloat(confianca.toFixed(2)),
      midias: midiasMeta || [],
      precisaMaisMidias: confianca < 0.7,
    };

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Erro na triagem:', error);
    return new Response(JSON.stringify({ error: 'Erro ao processar triagem' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
