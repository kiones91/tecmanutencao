'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  FileText,
  Wrench,
  ArrowRight,
  Activity,
  ShieldCheck,
  Sparkles,
  RefreshCw,
  HardHat,
  DollarSign,
  AlertTriangle,
  Zap,
  TrendingUp,
  Cpu,
  Layers,
  PhoneCall,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    leadsNovos: 0,
    leadsTotal: 0,
    clientesTotal: 0,
    orcamentosTotal: 0,
  });
  const [carregando, setCarregando] = useState(true);

  const supabase = createClient();

  async function carregarMetricas() {
    setCarregando(true);
    try {
      const [
        { count: leadsNovosCount },
        { count: leadsTotalCount },
        { count: clientesCount },
        { count: orcamentosCount },
      ] = await Promise.all([
        supabase.from('leads').select('*', { count: 'exact', head: true }).eq('status', 'novo'),
        supabase.from('leads').select('*', { count: 'exact', head: true }),
        supabase.from('clientes').select('*', { count: 'exact', head: true }),
        supabase.from('orcamentos').select('*', { count: 'exact', head: true }),
      ]);

      setStats({
        leadsNovos: leadsNovosCount || 0,
        leadsTotal: leadsTotalCount || 0,
        clientesTotal: clientesCount || 0,
        orcamentosTotal: orcamentosCount || 0,
      });
    } catch (err) {
      console.error('Erro ao carregar métricas:', err);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarMetricas();
  }, []);

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* HUD Header Banner */}
      <section className="relative rounded-2xl sm:rounded-3xl p-5 sm:p-8 lumimotion-card overflow-hidden">
        {/* Subtle Ambient Backlight */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#fcdc5d]/10 via-emerald-500/5 to-transparent blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121824] border border-[#232d42] text-[11px] font-semibold text-emerald-400 shadow-inner">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse"></span>
              <span>Central Operacional MDK • 99.9% Uptime</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-outfit text-white tracking-tight">
              Painel de Operações
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              Visão consolidada de triagem inteligente, atendimentos em campo, orçamentos e contratos industriais.
            </p>
          </div>

          {/* Quick Action CTAs */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-2 md:pt-0">
            <button
              onClick={carregarMetricas}
              disabled={carregando}
              className="flex items-center justify-center p-2.5 sm:px-3 sm:py-2.5 rounded-xl border border-[#232d42] bg-[#0c1018] hover:bg-[#141b29] text-slate-300 hover:text-white transition-all text-xs font-semibold"
              title="Atualizar Métricas"
            >
              <RefreshCw className={`w-4 h-4 ${carregando ? 'animate-spin text-[#fcdc5d]' : ''}`} />
              <span className="hidden sm:inline ml-2">Atualizar</span>
            </button>

            <Link
              href="/atendimento"
              target="_blank"
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#fcdc5d] hover:bg-[#f5cb3c] text-[#0a0d14] font-bold text-xs sm:text-sm shadow-[0_4px_20px_rgba(252,220,93,0.25)] active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Abrir Chat Faísca</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Lumimotion KPI Stats Grid (100% Mobile Optimized) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
        {/* Card 1: Leads Novos */}
        <Link
          href="/admin/leads"
          className="lumimotion-card lumimotion-card-glow rounded-2xl p-5 sm:p-6 transition-all group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Leads em Triagem
              </span>
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl sm:text-4xl font-extrabold font-outfit text-white tracking-tight">
                {carregando ? '...' : stats.leadsNovos}
              </p>
              {stats.leadsNovos > 0 && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Requer Ação
                </span>
              )}
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#232d42]/60 flex items-center justify-between text-xs text-blue-400">
            <span>{stats.leadsTotal} leads totais</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Card 2: Clientes Ativos */}
        <Link
          href="/admin/contratos"
          className="lumimotion-card lumimotion-card-glow rounded-2xl p-5 sm:p-6 transition-all group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Clientes & Contratos
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl sm:text-4xl font-extrabold font-outfit text-white tracking-tight">
                {carregando ? '...' : stats.clientesTotal}
              </p>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Ativos
              </span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#232d42]/60 flex items-center justify-between text-xs text-emerald-400">
            <span>Manutenções Preventivas</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Card 3: Orçamentos Técnicos */}
        <Link
          href="/admin/orcamentos"
          className="lumimotion-card lumimotion-card-glow rounded-2xl p-5 sm:p-6 transition-all group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Orçamentos & ART
              </span>
              <div className="w-8 h-8 rounded-xl bg-[#fcdc5d]/10 border border-[#fcdc5d]/20 flex items-center justify-center text-[#fcdc5d] group-hover:scale-110 transition-transform">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl sm:text-4xl font-extrabold font-outfit text-white tracking-tight">
                {carregando ? '...' : stats.orcamentosTotal}
              </p>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#fcdc5d]/20 text-[#fcdc5d] border border-[#fcdc5d]/30">
                Turnkey
              </span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#232d42]/60 flex items-center justify-between text-xs text-[#fcdc5d]">
            <span>Propostas comerciais</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Card 4: Faturamento & DRE */}
        <Link
          href="/admin/financeiro"
          className="lumimotion-card lumimotion-card-glow rounded-2xl p-5 sm:p-6 transition-all group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Saúde Financeira
              </span>
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl sm:text-3xl font-extrabold font-outfit text-white tracking-tight">
                DRE & Caixa
              </p>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#232d42]/60 flex items-center justify-between text-xs text-purple-400">
            <span>Fluxo em tempo real</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </section>

      {/* Quick Navigation Cards Grid (Ergonomic Touch Targets) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold font-outfit text-white">
            Acesso Rápido aos Módulos
          </h2>
          <span className="text-xs text-slate-400">Ambiente de Produção MDK</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          <Link
            href="/admin/leads"
            className="p-4 rounded-2xl lumimotion-card lumimotion-card-glow flex flex-col items-center justify-center text-center group transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform mb-2.5">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-white group-hover:text-[#fcdc5d] transition-colors">
              Leads CRM
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5">Triagem de Chamados</span>
          </Link>

          <Link
            href="/admin/orcamentos"
            className="p-4 rounded-2xl lumimotion-card lumimotion-card-glow flex flex-col items-center justify-center text-center group transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-[#fcdc5d]/10 border border-[#fcdc5d]/20 flex items-center justify-center text-[#fcdc5d] group-hover:scale-110 transition-transform mb-2.5">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-white group-hover:text-[#fcdc5d] transition-colors">
              Orçamentos
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5">Gerador Turnkey</span>
          </Link>

          <Link
            href="/admin/contratos"
            className="p-4 rounded-2xl lumimotion-card lumimotion-card-glow flex flex-col items-center justify-center text-center group transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform mb-2.5">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-white group-hover:text-[#fcdc5d] transition-colors">
              Contratos
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5">Gestão Recorrente</span>
          </Link>

          <Link
            href="/campo"
            className="p-4 rounded-2xl lumimotion-card lumimotion-card-glow flex flex-col items-center justify-center text-center group transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform mb-2.5">
              <HardHat className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-white group-hover:text-[#fcdc5d] transition-colors">
              Modo Campo
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5">Checklist Técnico</span>
          </Link>

          <Link
            href="/admin/suprimentos"
            className="p-4 rounded-2xl lumimotion-card lumimotion-card-glow flex flex-col items-center justify-center text-center group transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform mb-2.5">
              <Layers className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-white group-hover:text-[#fcdc5d] transition-colors">
              Suprimentos
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5">Estoque & Peças</span>
          </Link>

          <Link
            href="/admin/bi"
            className="p-4 rounded-2xl lumimotion-card lumimotion-card-glow flex flex-col items-center justify-center text-center group transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 group-hover:scale-110 transition-transform mb-2.5">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-white group-hover:text-[#fcdc5d] transition-colors">
              BI Industrial
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5">Métricas & OEE</span>
          </Link>
        </div>
      </section>

      {/* Emergency & 24h Support Alert Strip */}
      <section className="rounded-2xl p-4 sm:p-5 bg-gradient-to-r from-red-950/40 via-[#141824] to-[#0f1420] border border-red-800/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0 animate-pulse">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-white">Canal de Emergência Industrial 24h</h3>
            <p className="text-[11px] text-slate-400">Atendimento prioritário para máquinas paradas e paradas críticas de fábrica.</p>
          </div>
        </div>

        <a
          href="https://wa.me/5519983808498?text=EMERGENCIA:%20M%C3%A1quina%20Parada%20na%20F%C3%A1brica"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-xs transition-all shadow-md shadow-red-500/20 shrink-0"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>Chamar Plantão</span>
        </a>
      </section>
    </div>
  );
}
