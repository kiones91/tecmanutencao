'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Users,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Copy,
  Trash2,
  MessageSquare,
  RefreshCw,
  Loader2,
  Clock,
  ShieldAlert,
  Sparkles,
  ExternalLink,
  Phone,
  Zap,
  ArrowUpRight,
  AlertTriangle,
  ChevronDown,
} from 'lucide-react';
import Link from 'next/link';
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
    servico?: string;
    maquina?: string;
    tensao?: string;
    empresa?: string;
    cidade?: string;
  };
  criado_em: string;
}

const STATUS_TABS = [
  { id: 'todos', label: 'Todos' },
  { id: 'novo', label: 'Novos' },
  { id: 'qualificado', label: 'Qualificados' },
  { id: 'confirmado', label: 'Confirmados' },
  { id: 'convertido', label: 'Convertidos' },
  { id: 'descartado', label: 'Descartados' },
];

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
        () => {
          carregarLeads();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, carregarLeads]);

  const atualizarStatusLead = async (id: string, novoStatus: string) => {
    setAtualizandoId(id);
    try {
      const { error } = await supabase
        .from('leads')
        .update({ status: novoStatus })
        .eq('id', id);

      if (!error) {
        setLeads((prev) =>
          prev.map((lead) => (lead.id === id ? { ...lead, status: novoStatus as any } : lead))
        );
      }
    } catch (err) {
      console.error('Erro ao atualizar status:', err);
    } finally {
      setAtualizandoId(null);
    }
  };

  const leadsFiltrados = leads.filter((lead) => {
    const matchStatus = filtroStatus === 'todos' || lead.status === filtroStatus;
    const matchBusca =
      !busca ||
      lead.nome?.toLowerCase().includes(busca.toLowerCase()) ||
      lead.whatsapp?.includes(busca) ||
      lead.payload_ia?.resumo?.toLowerCase().includes(busca.toLowerCase()) ||
      lead.payload_ia?.empresa?.toLowerCase().includes(busca.toLowerCase());
    return matchStatus && matchBusca;
  });

  return (
    <div className="space-y-5 sm:space-y-6 animate-in fade-in duration-300">
      {/* Header with Title & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold font-outfit text-white tracking-tight">
              CRM de Triagem & Leads
            </h1>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-[#fcdc5d]/10 text-[#fcdc5d] border border-[#fcdc5d]/20">
              {leads.length}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Triagem automatizada com inteligência artificial e sincronização em tempo real.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={carregarLeads}
            disabled={carregando}
            className="p-2 sm:px-3 sm:py-2 rounded-xl lumimotion-card text-slate-300 hover:text-white flex items-center gap-1.5 text-xs font-semibold"
            title="Atualizar lista"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${carregando ? 'animate-spin text-[#fcdc5d]' : ''}`} />
            <span className="hidden sm:inline">Recarregar</span>
          </button>

          <Link
            href="/atendimento"
            target="_blank"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#fcdc5d] hover:bg-[#f5cb3c] text-[#0a0d14] font-bold text-xs shadow-md shadow-[#fcdc5d]/15"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Simular Faísca</span>
          </Link>
        </div>
      </div>

      {/* Search & Horizontal Touch Filters (Mobile-First) */}
      <div className="space-y-3">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por cliente, WhatsApp, máquina ou empresa..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0c1018] border border-[#232d42] text-xs sm:text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#fcdc5d] focus:ring-1 focus:ring-[#fcdc5d]/30 transition-all"
          />
        </div>

        {/* Horizontal Scrolling Filter Pills for Thumb Navigation */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {STATUS_TABS.map((tab) => {
            const count =
              tab.id === 'todos' ? leads.length : leads.filter((l) => l.status === tab.id).length;
            const isSelected = filtroStatus === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setFiltroStatus(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#fcdc5d] text-[#0a0d14] font-bold shadow-sm shadow-[#fcdc5d]/20'
                    : 'bg-[#0e1420] text-slate-400 hover:text-white border border-[#232d42]'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-[#0a0d14]/20 text-[#0a0d14]' : 'bg-[#182133] text-slate-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Leads List Container (Cards on Mobile, High-Density on Desktop) */}
      {carregando && leads.length === 0 ? (
        <div className="py-16 text-center text-slate-500 lumimotion-card rounded-2xl">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#fcdc5d] mb-3" />
          <p className="text-xs font-mono">SINCRONIZANDO LEADS EM TEMPO REAL...</p>
        </div>
      ) : leadsFiltrados.length === 0 ? (
        <div className="py-16 text-center text-slate-500 lumimotion-card rounded-2xl">
          <Users className="w-10 h-10 mx-auto text-slate-600 mb-2 opacity-50" />
          <p className="text-sm font-semibold text-slate-300">Nenhum lead encontrado</p>
          <p className="text-xs text-slate-500 mt-1">Tente ajustar o filtro de status ou termo de busca.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {leadsFiltrados.map((lead) => {
            const badge = STATUS_BADGES[lead.status] || {
              bg: 'bg-slate-500/10',
              text: 'text-slate-400',
              border: 'border-slate-500/30',
            };
            const isCritica =
              lead.payload_ia?.urgencia === 'critica' ||
              lead.payload_ia?.resumo?.toLowerCase().includes('emergência');

            const zapNumber = lead.whatsapp?.replace(/\D/g, '');
            const zapLink = zapNumber ? `https://wa.me/${zapNumber.startsWith('55') ? zapNumber : `55${zapNumber}`}` : null;

            return (
              <div
                key={lead.id}
                className={`lumimotion-card rounded-2xl p-4 sm:p-5 transition-all relative overflow-hidden ${
                  isCritica ? 'border-red-800/60 shadow-[0_0_20px_rgba(239,68,68,0.1)]' : ''
                }`}
              >
                {/* Emergency top stripe */}
                {isCritica && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-amber-500 to-red-500 animate-pulse"></div>
                )}

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4">
                  {/* Left Column: Lead Info */}
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm sm:text-base font-bold font-outfit text-white">
                        {lead.nome || 'Lead Sem Nome'}
                      </h3>

                      {/* Status Badge */}
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${badge.bg} ${badge.text} ${badge.border}`}
                      >
                        {lead.status}
                      </span>

                      {/* Urgency Badge */}
                      {isCritica && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/40 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-red-400" />
                          <span>MÁQUINA PARADA</span>
                        </span>
                      )}

                      {/* AI Tag */}
                      {lead.origem === 'atendimento_ia' && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#fcdc5d]/10 text-[#fcdc5d] border border-[#fcdc5d]/20 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          <span>Assistente Faísca</span>
                        </span>
                      )}
                    </div>

                    {/* Metadata tags: Empresa, Máquina, Data */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
                      {lead.payload_ia?.empresa && (
                        <span className="text-slate-300 font-medium">
                          🏭 {lead.payload_ia.empresa}
                        </span>
                      )}
                      {lead.payload_ia?.maquina && (
                        <span className="text-slate-300">
                          ⚙️ {lead.payload_ia.maquina}
                        </span>
                      )}
                      {lead.payload_ia?.cidade && (
                        <span>📍 {lead.payload_ia.cidade}</span>
                      )}
                      <span className="flex items-center gap-1 text-slate-500 font-mono text-[11px]">
                        <Clock className="w-3 h-3" />
                        {new Date(lead.criado_em).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    {/* AI Diagnostic Summary */}
                    {lead.payload_ia?.resumo && (
                      <p className="text-xs text-slate-300 bg-[#070a10]/80 p-2.5 rounded-xl border border-[#1e2738] leading-relaxed mt-2">
                        {lead.payload_ia.resumo}
                      </p>
                    )}
                  </div>

                  {/* Right Column: Actions & Contact */}
                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-[#232d42]/60">
                    {/* Status Dropdown */}
                    <select
                      value={lead.status}
                      disabled={atualizandoId === lead.id}
                      onChange={(e) => atualizarStatusLead(lead.id, e.target.value)}
                      className="px-2.5 py-2 rounded-xl bg-[#0c1018] border border-[#232d42] text-xs font-semibold text-slate-300 focus:outline-none focus:border-[#fcdc5d] transition-all cursor-pointer"
                    >
                      <option value="novo">Novo</option>
                      <option value="qualificado">Qualificado</option>
                      <option value="confirmado">Confirmado</option>
                      <option value="convertido">Convertido</option>
                      <option value="descartado">Descartado</option>
                      <option value="duplicado">Duplicado</option>
                      <option value="invalido">Inválido</option>
                    </select>

                    {/* WhatsApp Action Button */}
                    {zapLink && (
                      <a
                        href={zapLink}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-bold text-xs transition-all shadow-sm shadow-emerald-500/20"
                        title="Conversar no WhatsApp"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
