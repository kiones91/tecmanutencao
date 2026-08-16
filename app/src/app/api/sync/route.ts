import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { OutboxItem } from '@/core/offline-sync';

export const dynamic = 'force-dynamic';

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items } = body as { items: OutboxItem[] };

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: true, processados: 0, resultados: [] });
    }

    const supabase = getSupabaseAdmin();
    const resultados: { sync_id: string; status: 'sucesso' | 'erro'; mensagem?: string }[] = [];

    for (const item of items) {
      try {
        if (item.tipo === 'apontamento') {
          const { sync_id, os_id, recurso_id, data, horas, adicionais, geo } = item.payload;

          const { error } = await supabase.from('apontamentos').upsert(
            {
              sync_id,
              os_id: os_id || null,
              recurso_id: recurso_id || null,
              data: data || new Date().toISOString().split('T')[0],
              horas: Number(horas) || 0,
              adicionais: adicionais || {},
              geo: geo || null,
              sync_status: 'sincronizado',
            },
            { onConflict: 'sync_id' }
          );

          if (error) throw error;
          resultados.push({ sync_id, status: 'sucesso' });
        } else if (item.tipo === 'assinatura') {
          const { sync_id, os_id, signatario_nome, signatario_doc, hash_documento, termo_versao, geo, user_agent, imagem_base64 } = item.payload;

          // Se tiver imagem base64, salvar caminho ou persistir
          const { error } = await supabase.from('assinaturas').upsert(
            {
              sync_id,
              os_id: os_id || null,
              signatario_nome,
              signatario_doc,
              imagem_path: imagem_base64 ? `assinaturas/${sync_id}.png` : 'assinatura_touch',
              hash_documento,
              termo_versao: termo_versao || 1,
              geo: geo || null,
              user_agent: user_agent || 'PWA Field',
            },
            { onConflict: 'sync_id' }
          );

          if (error) throw error;

          // Atualizar status da OS para assinada / concluida
          if (os_id) {
            await supabase.from('ordens_servico').update({ status: 'assinada' }).eq('id', os_id);
          }

          resultados.push({ sync_id, status: 'sucesso' });
        } else if (item.tipo === 'status_os' || item.tipo === 'checkin' || item.tipo === 'checkout') {
          const { sync_id, os_id, tipo, status_novo, geo } = item.payload;

          // Registrar evento de OS
          await supabase.from('os_eventos').upsert(
            {
              sync_id,
              os_id: os_id || null,
              tipo: tipo || item.tipo,
              payload: { ...item.payload, geo },
            },
            { onConflict: 'sync_id' }
          );

          // Se tiver mudança de status na OS
          if (os_id && status_novo) {
            await supabase.from('ordens_servico').update({ status: status_novo }).eq('id', os_id);
          }

          resultados.push({ sync_id, status: 'sucesso' });
        } else {
          resultados.push({ sync_id: item.sync_id, status: 'sucesso' });
        }
      } catch (itemErr: any) {
        console.error(`Erro ao sincronizar item ${item.sync_id}:`, itemErr);
        resultados.push({
          sync_id: item.sync_id,
          status: 'erro',
          mensagem: itemErr.message || 'Erro ao persistir no Supabase',
        });
      }
    }

    return NextResponse.json({
      success: true,
      processados: resultados.length,
      resultados,
    });
  } catch (error: any) {
    console.error('Erro na rota de sync:', error);
    return NextResponse.json(
      { error: 'Erro ao processar sincronização', detalhes: error.message },
      { status: 500 }
    );
  }
}
