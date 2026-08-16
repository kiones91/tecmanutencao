'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Users, Search, Filter, CheckCircle, XCircle, Copy, UserPlus, 
  Trash2, MessageSquare, RefreshCw, Loader2, ArrowLeft, LogOut,
  Clock, ShieldAlert, Sparkles, ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

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
    qtd_midias?: number;
  };
  criado_em: string;
}

const STATUS_LABELS: Record<string, string> = {
  todos: 'Todos os Leads',
  novo: 'Novos',
  confirmado: 'Confirmados',
  qualificado: 'Qualificados',
  convertido: 'Convertidos',
  descartado: 'Descartados',
  duplicado: 'Duplicados',
  invalido: 'Inválidos',
};

const STATUS_BADGES: Record<string, { bg: string; text: string; border: string }> = {
  novo: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
  confirmado: { bg: 'bg-teal-500/10', text: 'text-teal-400', border: 'border-teal-500/30' },
  qualificado: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30' },
  convertido: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  descartado: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/30' },
  duplicado: { bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/30' },
  invalido: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30' },
};

export default function LeadsPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');
  const [busca, setBusca] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [atualizandoId, setAtualizandoId] = useState<string | null>(null);

  const supabase = createClient();

  const carregarLeads = useCallback(async () => {
    setCarregando(true);
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('criado_em', { ascending: false });

      if (error) {
        console.error('Erro ao buscar leads:', error);
      } else {
        setLeads(data || []);
      }
    } catch (err) {
      console.error('Erro inesperado ao carregar leads:', err);
    } finally {
      setCarregando(false);
    }
  }, [supabase]);

  // Realtime subscription
  useEffect(() => {
    carregarLeads();

    const channel = supabase
      .channel('realtime_leads_channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'leads' },
        (payload) => {
          console.log('Evento Realtime recebido:', payload);
          carregarLeads();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, carregarLeads]);

  const atualizarStatus = async (id: string, novoStatus: Lead['status']) => {
    setAtualizandoId(id);
    try {
      const { error } = await supabase
        .from('leads')
        .update({ status: novoStatus })
        .eq('id', id);

      if (error) {
        console.error('Erro ao atualizar status:', error);
      } else {
        setLeads((prev) =>
          prev.map((lead) => (lead.id === id ? { ...lead, status: novoStatus } : lead))
        );
      }
    } finally {
      setAtualizandoId(null);
    }
  };

  const descartarLead = async (id: string) => {
    if (!confirm('Deseja realmente descartar este lead?')) return;
    await atualizarStatus(id, 'descartado');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  const leadsFiltrados = leads.filter((lead) => {
    const matchStatus = filtroStatus === 'todos' || lead.status === filtroStatus;
    const matchBusca =
      (lead.nome || '').toLowerCase().includes(busca.toLowerCase()) ||
      (lead.whatsapp || '').includes(busca) ||
      (lead.payload_ia?.resumo || '').toLowerCase().includes(busca.toLowerCase());
    return matchStatus && matchBusca;
  });

  return (
    <div className="min-h-screen bg-[#0a0d14] text-[#f8fafc]">
      {/* Header */}
      <header className="border-b border-[#232b3e] bg-[#111622] sticky top-0 z-30">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="p-2 rounded-xl bg-[#161c2c] hover:bg-[#1f283d] border border-[#232b3e] text-[#94a3b8] hover:text-white transition-colors"
              title="Voltar ao Painel"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold font-outfit text-white">CRM de Leads</h1>
                <span className="flex items-center gap-1 text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Realtime Ativo
                </span>
              </div>
              <p className="text-xs text-[#94a3b8]">Triagem inteligente e gestão de contatos</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={carregarLeads}
              disabled={carregando}
              className="p-2 rounded-xl bg-[#161c2c] hover:bg-[#1f283d] border border-[#232b3e] text-[#94a3b8] hover:text-white transition-colors disabled:opacity-50"
              title="Atualizar lista"
            >
              <RefreshCw className={`w-4 h-4 ${carregando ? 'animate-spin text-[#fcdc5d]' : ''}`} />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-xs font-semibold text-red-400 hover:text-red-300 border border-red-900/40 hover:border-red-800 bg-red-950/20 px-3 py-2 rounded-xl transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Controls bar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-8">
          {/* Search */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-[#94a3b8] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por nome, WhatsApp ou descrição..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#161c2c] border border-[#232b3e] rounded-xl text-sm text-white placeholder-[#94a3b8]/40 focus:outline-none focus:border-[#fcdc5d] transition-colors"
            />
          </div>

          {/* Status filters */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {Object.entries(STATUS_LABELS).map(([statusKey, label]) => {
              const count = statusKey === 'todos' 
                ? leads.length 
                : leads.filter((l) => l.status === statusKey).length;
              const isActive = filtroStatus === statusKey;

              return (
                <button
                  key={statusKey}
                  onClick={() => setFiltroStatus(statusKey)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all border ${
                    isActive
                      ? 'bg-[#fcdc5d] text-[#0a0d14] font-bold border-[#fcdc5d] shadow-sm'
                      : 'bg-[#161c2c] text-[#94a3b8] hover:text-white border-[#232b3e] hover:border-[#384561]'
                  }`}
                >
                  {label} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Section */}
        {carregando && leads.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-[#94a3b8]">
            <Loader2 className="w-8 h-8 animate-spin text-[#fcdc5d] mb-4" />
            <p className="text-sm">Carregando leads do Supabase...</p>
          </div>
        ) : leadsFiltrados.length === 0 ? (
          <div className="bg-[#161c2c] border border-[#232b3e] rounded-2xl p-12 text-center max-w-md mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-[#111622] border border-[#232b3e] flex items-center justify-center mx-auto mb-4 text-[#94a3b8]">
              <Users className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Nenhum lead encontrado</h3>
            <p className="text-xs text-[#94a3b8] mb-6">
              {busca || filtroStatus !== 'todos'
                ? 'Tente ajustar os filtros ou termo de busca.'
                : 'Os leads recebidos via /atendimento aparecerão aqui em tempo real.'}
            </p>
            <Link
              href="/atendimento"
              target="_blank"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#0a0d14] bg-[#fcdc5d] hover:bg-[#f5cb3c] px-4 py-2.5 rounded-xl transition-all"
            >
              <span>Abrir Formulário de Teste</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {leadsFiltrados.map((lead) => {
              const badge = STATUS_BADGES[lead.status] || STATUS_BADGES.novo;
              const isEmergencia = lead.payload_ia?.urgencia === 'alta';
              const whatsappUrl = `https://wa.me/55${lead.whatsapp}?text=${encodeURIComponent(
                `Olá ${lead.nome}, recebemos sua solicitação na TecManutenções sobre "${lead.payload_ia?.resumo || 'manutenção'}". Como podemos prosseguir?`
              )}`;

              return (
                <div
                  key={lead.id}
                  className={`bg-[#161c2c] border rounded-2xl p-5 flex flex-col justify-between transition-all hover:border-[#3b4764] shadow-lg ${
                    isEmergencia ? 'border-red-500/40 bg-gradient-to-b from-red-950/20 to-[#161c2c]' : 'border-[#232b3e]'
                  }`}
                >
                  <div>
                    {/* Card Header */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <h4 className="font-bold text-white text-base leading-tight flex items-center gap-2">
                          <span>{lead.nome || 'Cliente Sem Nome'}</span>
                          {isEmergencia && (
                            <span title="Emergência / Urgente" className="p-0.5 rounded bg-red-500/20 text-red-400">
                              <ShieldAlert className="w-4 h-4" />
                            </span>
                          )}
                        </h4>
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-[#fcdc5d] hover:underline flex items-center gap-1 mt-1 font-mono"
                        >
                          <MessageSquare className="w-3 h-3" />
                          <span>{lead.whatsapp}</span>
                        </a>
                      </div>

                      <span
                        className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border uppercase tracking-wider ${badge.bg} ${badge.text} ${badge.border}`}
                      >
                        {STATUS_LABELS[lead.status] || lead.status}
                      </span>
                    </div>

                    {/* Resumo IA */}
                    <div className="bg-[#111622] rounded-xl p-3 border border-[#232b3e] mb-4">
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#94a3b8] mb-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#fcdc5d]" />
                        <span>Resumo do Atendimento:</span>
                      </div>
                      <p className="text-xs text-[#f8fafc] leading-relaxed line-clamp-3">
                        {lead.payload_ia?.resumo || 'Sem descrição informada.'}
                      </p>
                    </div>

                    {/* Meta info */}
                    <div className="flex items-center justify-between text-[11px] text-[#94a3b8] mb-4">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(lead.criado_em).toLocaleString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      <span className="font-mono text-emerald-400">
                        Score: {lead.score || 0}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-[#232b3e] flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      {lead.status !== 'qualificado' && lead.status !== 'convertido' && (
                        <button
                          onClick={() => atualizarStatus(lead.id, 'qualificado')}
                          disabled={atualizandoId === lead.id}
                          className="text-[11px] font-semibold px-2.5 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 transition-colors"
                        >
                          Qualificar
                        </button>
                      )}
                      {lead.status === 'qualificado' && (
                        <Link
                          href={`/admin/orcamentos?leadId=${lead.id}`}
                          className="text-[11px] font-bold px-2.5 py-1.5 rounded-lg bg-[#fcdc5d] hover:bg-[#f5cb3c] text-[#0a0d14] transition-colors"
                        >
                          Criar Orçamento
                        </Link>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-colors"
                        title="Conversar no WhatsApp"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </a>
                      {lead.status !== 'descartado' && (
                        <button
                          onClick={() => descartarLead(lead.id)}
                          disabled={atualizandoId === lead.id}
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition-colors"
                          title="Descartar Lead"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
