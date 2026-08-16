'use client';

import { useState, useEffect } from 'react';
import { Users, Search, Filter, CheckCircle, XCircle, Copy, UserPlus, Trash2 } from 'lucide-react';

interface Lead {
  id: string;
  nome: string;
  whatsapp: string;
  origem: string;
  status: 'novo' | 'confirmado' | 'qualificado' | 'duplicado' | 'invalido' | 'descartado' | 'convertido';
  score: number;
  payload_ia?: {
    resumo: string;
    categoria: string;
    urgencia: string;
    confianca: number;
  };
  criado_em: string;
}

const STATUS_LABELS = {
  novo: 'Novo',
  confirmado: 'Confirmado',
  qualificado: 'Qualificado',
  duplicado: 'Duplicado',
  invalido: 'Inválido',
  descartado: 'Descartado',
  convertido: 'Convertido',
};

const STATUS_COLORS = {
  novo: 'bg-blue-600',
  confirmado: 'bg-green-600',
  qualificado: 'bg-purple-600',
  duplicado: 'bg-gray-600',
  invalido: 'bg-red-600',
  descartado: 'bg-orange-600',
  convertido: 'bg-emerald-600',
};

// Mock de leads para desenvolvimento
const MOCK_LEADS: Lead[] = [
  {
    id: '1',
    nome: 'João Silva',
    whatsapp: '11999999999',
    origem: 'site',
    status: 'novo',
    score: 85,
    payload_ia: {
      resumo: 'Cliente precisa de manutenção em painel industrial',
      categoria: 'industrial',
      urgencia: 'media',
      confianca: 0.9,
    },
    criado_em: new Date().toISOString(),
  },
];

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');
  const [busca, setBusca] = useState('');
  const [carregando, setCarregando] = useState(false);

  // Carregar leads com realtime
  useEffect(() => {
    carregarLeads();

    // Subscribe para updates em tempo real
    const channel = supabase
      .channel('leads-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'leads' },
        () => {
          carregarLeads();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const carregarLeads = async () => {
    setCarregando(true);
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('criado_em', { ascending: false });

    if (error) {
      console.error('Erro ao carregar leads:', error);
    } else {
      setLeads(data || []);
    }
    setCarregando(false);
  };

  // Filtrar leads
  const leadsFiltrados = leads.filter((lead) => {
    const matchStatus = filtroStatus === 'todos' || lead.status === filtroStatus;
    const matchBusca = 
      lead.nome.toLowerCase().includes(busca.toLowerCase()) ||
      lead.whatsapp.includes(busca);
    return matchStatus && matchBusca;
  });

  // Atualizar status do lead
  const atualizarStatus = async (leadId: string, novoStatus: Lead['status']) => {
    const { error } = await supabase
      .from('leads')
      .update({ status: novoStatus })
      .eq('id', leadId);

    if (error) {
      console.error('Erro ao atualizar status:', error);
    } else {
      carregarLeads();
    }
  };

  // Converter lead em cliente
  const converterEmCliente = async (lead: Lead) => {
    const { data: cliente, error: erroCliente } = await supabase
      .from('clientes')
      .insert({
        nome: lead.nome,
        whatsapp: lead.whatsapp,
        tipo: 'ambos',
        observacoes: `Convertido de lead ${lead.id} em ${new Date().toLocaleDateString()}`,
      })
      .select()
      .single();

    if (erroCliente) {
      console.error('Erro ao criar cliente:', erroCliente);
      return;
    }

    // Atualizar lead como convertido
    await atualizarStatus(lead.id, 'convertido');
    
    // Vincular lead ao cliente
    await supabase
      .from('leads')
      .update({ cliente_id: cliente.id })
      .eq('id', lead.id);

    alert(`Cliente "${lead.nome}" criado com sucesso!`);
  };

  return (
    <div className="min-h-screen bg-[#0a0d14] text-[#f8fafc]">
      {/* Header */}
      <header className="border-b border-[#232b3e] bg-[#111622]">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="h-6 w-6 text-[#fcdc5d]" />
            <div>
              <h1 className="text-xl font-bold font-outfit">CRM - Leads</h1>
              <p className="text-xs text-[#94a3b8]">Gerencie suas oportunidades</p>
            </div>
          </div>
          <div className="text-sm text-[#94a3b8]">
            {leads.length} leads • {leads.filter(l => l.status === 'novo').length} novos
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Filtros e Busca */}
        <div className="bg-[#161c2c] rounded-2xl p-4 border border-[#232b3e] mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Busca */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#94a3b8]" />
              <input
                type="text"
                placeholder="Buscar por nome ou WhatsApp..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full bg-[#111622] border border-[#232b3e] rounded-xl pl-10 pr-4 py-3 text-[#f8fafc] focus:outline-none focus:border-[#fcdc5d]"
              />
            </div>

            {/* Filtro por Status */}
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-[#94a3b8]" />
              <select
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value)}
                className="bg-[#111622] border border-[#232b3e] rounded-xl px-4 py-3 text-[#f8fafc] focus:outline-none focus:border-[#fcdc5d]"
              >
                <option value="todos">Todos os status</option>
                {Object.entries(STATUS_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Lista de Leads */}
        {carregando ? (
          <div className="text-center py-12 text-[#94a3b8]">Carregando leads...</div>
        ) : leadsFiltrados.length === 0 ? (
          <div className="text-center py-12 text-[#94a3b8]">Nenhum lead encontrado</div>
        ) : (
          <div className="space-y-4">
            {leadsFiltrados.map((lead) => (
              <div
                key={lead.id}
                className="bg-[#161c2c] rounded-xl p-4 border border-[#232b3e] hover:border-[#fcdc5d]/50 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Informações do Lead */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{lead.nome}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[lead.status]}`}>
                        {STATUS_LABELS[lead.status]}
                      </span>
                      {lead.payload_ia?.urgencia === 'alta' && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-600 animate-pulse">
                          Urgente
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-[#94a3b8] space-y-1">
                      <p>📱 {lead.whatsapp}</p>
                      <p>📊 Score: {lead.score}/100</p>
                      {lead.payload_ia && (
                        <>
                          <p>🏷️ Categoria: {lead.payload_ia.categoria}</p>
                          <p>💡 Confiança IA: {(lead.payload_ia.confianca * 100).toFixed(0)}%</p>
                          <p className="text-xs mt-2 italic">"{lead.payload_ia.resumo}"</p>
                        </>
                      )}
                      <p className="text-xs">🕒 {new Date(lead.criado_em).toLocaleString('pt-BR')}</p>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex flex-wrap gap-2">
                    {lead.status === 'novo' && (
                      <>
                        <button
                          onClick={() => atualizarStatus(lead.id, 'confirmado')}
                          className="px-3 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium transition-colors"
                        >
                          Confirmar
                        </button>
                        <button
                          onClick={() => atualizarStatus(lead.id, 'invalido')}
                          className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition-colors"
                        >
                          Inválido
                        </button>
                      </>
                    )}
                    {lead.status === 'confirmado' && (
                      <>
                        <button
                          onClick={() => atualizarStatus(lead.id, 'qualificado')}
                          className="px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium transition-colors"
                        >
                          Qualificar
                        </button>
                        <button
                          onClick={() => converterEmCliente(lead)}
                          className="px-3 py-2 bg-[#fcdc5d] hover:bg-[#f5cb3c] text-[#0a0d14] rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                        >
                          <UserPlus className="h-4 w-4" />
                          Converter
                        </button>
                      </>
                    )}
                    {lead.status === 'qualificado' && (
                      <button
                        onClick={() => converterEmCliente(lead)}
                        className="px-3 py-2 bg-[#fcdc5d] hover:bg-[#f5cb3c] text-[#0a0d14] rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                      >
                        <UserPlus className="h-4 w-4" />
                        Converter em Cliente
                      </button>
                    )}
                    {['novo', 'confirmado', 'qualificado', 'duplicado'].includes(lead.status) && (
                      <button
                        onClick={() => atualizarStatus(lead.id, 'duplicado')}
                        className="px-3 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    )}
                    {['descartado', 'invalido'].includes(lead.status) && (
                      <button
                        onClick={() => atualizarStatus(lead.id, 'novo')}
                        className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors"
                      >
                        Restaurar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
