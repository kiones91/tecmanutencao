'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft, User, Phone, Mail, MapPin, Calendar, CheckCircle, XCircle, FileText } from 'lucide-react';

interface Lead {
  id: string;
  nome: string;
  whatsapp: string;
  cpf_cnpj?: string;
  origem: string;
  status: string;
  score: number;
  payload_ia?: any;
  observacoes?: string;
  criado_em: string;
}

interface Midia {
  id: string;
  tipo: string;
  storage_path: string;
  criado_em: string;
}

export default function LeadDetalhePage() {
  const params = useParams();
  const router = useRouter();
  const leadId = params.id as string;
  
  const [lead, setLead] = useState<Lead | null>(null);
  const [midias, setMidias] = useState<Midia[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [urlAssinada, setUrlAssinada] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    carregarLead();
  }, [leadId]);

  const carregarLead = async () => {
    setCarregando(true);
    
    // Carregar lead
    const { data: leadData } = await supabase
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .single();

    if (leadData) {
      setLead(leadData);
      
      // Carregar mídias associadas
      const { data: midiasData } = await supabase
        .from('midias')
        .select('*')
        .eq('owner_type', 'leads')
        .eq('owner_id', leadId);
      
      setMidias(midiasData || []);
      
      // Gerar URL assinada para a primeira mídia (exemplo)
      if (midiasData && midiasData.length > 0) {
        const { data: urlData } = await supabase.storage
          .from('temp-public')
          .createSignedUrl(midiasData[0].storage_path, 3600);
        
        if (urlData) {
          setUrlAssinada(urlData.signedUrl);
        }
      }
    }
    
    setCarregando(false);
  };

  const atualizarStatus = async (novoStatus: string) => {
    if (!lead) return;
    
    const { error } = await supabase
      .from('leads')
      .update({ status: novoStatus })
      .eq('id', leadId);

    if (error) {
      console.error('Erro ao atualizar:', error);
    } else {
      setLead({ ...lead, status: novoStatus });
    }
  };

  if (carregando) {
    return (
      <div className="min-h-screen bg-[#0a0d14] text-[#f8fafc] flex items-center justify-center">
        Carregando...
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="min-h-screen bg-[#0a0d14] text-[#f8fafc] flex items-center justify-center">
        Lead não encontrado
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0d14] text-[#f8fafc]">
      {/* Header */}
      <header className="border-b border-[#232b3e] bg-[#111622]">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[#94a3b8] hover:text-[#f8fafc] transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Voltar para lista
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="space-y-6">
          {/* Card Principal */}
          <div className="bg-[#161c2c] rounded-2xl p-6 border border-[#232b3e]">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold font-outfit mb-2">{lead.nome}</h1>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    lead.status === 'novo' ? 'bg-blue-600' :
                    lead.status === 'confirmado' ? 'bg-green-600' :
                    lead.status === 'qualificado' ? 'bg-purple-600' :
                    lead.status === 'convertido' ? 'bg-emerald-600' :
                    'bg-gray-600'
                  }`}>
                    {lead.status.toUpperCase()}
                  </span>
                  <span className="text-sm text-[#94a3b8]">
                    Score: {lead.score}/100
                  </span>
                  {lead.payload_ia?.urgencia === 'alta' && (
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-600 animate-pulse">
                      URGENTE
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Informações */}
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-3 text-[#94a3b8]">
                <Phone className="h-5 w-5" />
                <span>{lead.whatsapp}</span>
              </div>
              {lead.cpf_cnpj && (
                <div className="flex items-center gap-3 text-[#94a3b8]">
                  <FileText className="h-5 w-5" />
                  <span>{lead.cpf_cnpj}</span>
                </div>
              )}
              <div className="flex items-center gap-3 text-[#94a3b8]">
                <Calendar className="h-5 w-5" />
                <span>Criado em: {new Date(lead.criado_em).toLocaleString('pt-BR')}</span>
              </div>
              <div className="flex items-center gap-3 text-[#94a3b8]">
                <User className="h-5 w-5" />
                <span>Origem: {lead.origem}</span>
              </div>
            </div>

            {/* Resumo da IA */}
            {lead.payload_ia && (
              <div className="bg-[#111622] rounded-xl p-4 border border-[#232b3e] mb-6">
                <h3 className="font-semibold mb-3">🤖 Análise da IA</h3>
                <div className="space-y-2 text-sm text-[#94a3b8]">
                  <p><strong>Resumo:</strong> {lead.payload_ia.resumo}</p>
                  <p><strong>Categoria:</strong> {lead.payload_ia.categoria}</p>
                  <p><strong>Urgência:</strong> {lead.payload_ia.urgencia}</p>
                  <p><strong>Confiança:</strong> {(lead.payload_ia.confianca * 100).toFixed(0)}%</p>
                </div>
              </div>
            )}

            {/* Mídias */}
            {midias.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-3">📎 Mídias ({midias.length})</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {midias.map((midia) => (
                    <div key={midia.id} className="bg-[#111622] rounded-lg overflow-hidden border border-[#232b3e]">
                      {midia.tipo === 'imagem' ? (
                        <img 
                          src={urlAssinada || '/placeholder.jpg'} 
                          alt="Mídia" 
                          className="w-full h-32 object-cover"
                        />
                      ) : (
                        <div className="w-full h-32 bg-[#232b3e] flex items-center justify-center">
                          <FileText className="h-8 w-8 text-[#94a3b8]" />
                        </div>
                      )}
                      <div className="p-2 text-xs text-[#94a3b8]">
                        {midia.tipo} • {new Date(midia.criado_em).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Ações */}
            <div className="border-t border-[#232b3e] pt-6">
              <h3 className="font-semibold mb-4">Ações</h3>
              <div className="flex flex-wrap gap-3">
                {lead.status === 'novo' && (
                  <>
                    <button
                      onClick={() => atualizarStatus('confirmado')}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Confirmar
                    </button>
                    <button
                      onClick={() => atualizarStatus('invalido')}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                      <XCircle className="h-4 w-4" />
                      Marcar como Inválido
                    </button>
                  </>
                )}
                {lead.status === 'confirmado' && (
                  <button
                    onClick={() => atualizarStatus('qualificado')}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors"
                  >
                    Qualificar Lead
                  </button>
                )}
                {['confirmado', 'qualificado'].includes(lead.status) && (
                  <button
                    onClick={async () => {
                      // Converter em cliente
                      const { data: cliente } = await supabase
                        .from('clientes')
                        .insert({
                          nome: lead.nome,
                          whatsapp: lead.whatsapp,
                          tipo: 'ambos',
                          observacoes: `Convertido do lead ${lead.id}`,
                        })
                        .select()
                        .single();
                      
                      if (cliente) {
                        await supabase
                          .from('leads')
                          .update({ status: 'convertido', cliente_id: cliente.id })
                          .eq('id', leadId);
                        
                        alert('Cliente criado com sucesso!');
                        router.push(`/admin/clientes/${cliente.id}`);
                      }
                    }}
                    className="px-4 py-2 bg-[#fcdc5d] hover:bg-[#f5cb3c] text-[#0a0d14] rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    <User className="h-4 w-4" />
                    Converter em Cliente
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
