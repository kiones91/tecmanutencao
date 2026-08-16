'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  BarChart3, TrendingUp, Users, ArrowLeft, ArrowUpRight, 
  DollarSign, PieChart, ShieldCheck, Zap, Activity, 
  Layers, Target, Award, Sparkles
} from 'lucide-react';
import { 
  calcularBIAnalytics, 
  calcularMetricasRecorrentes, 
  CONTRATOS_ATIVOS_INICIAIS 
} from '@/core/bi-contratos';

export default function BIPage() {
  const [periodo, setPeriodo] = useState<'mes' | 'trimestre' | 'ano'>('mes');

  const metricasRecorrentes = calcularMetricasRecorrentes(CONTRATOS_ATIVOS_INICIAIS);
  const bi = calcularBIAnalytics(24, 18, 12, 8, 380000);

  return (
    <div className="min-h-screen bg-[#0a0d14] text-[#f8fafc]">
      {/* Header */}
      <header className="border-b border-[#232b3e] bg-[#111622] sticky top-0 z-30">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="p-2 rounded-xl bg-[#161c2c] hover:bg-[#1f283d] border border-[#232b3e] text-[#94a3b8] hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-lg font-bold font-outfit text-white">Business Intelligence (BI) Executivo</h1>
              <p className="text-xs text-[#94a3b8]">Indicadores estratégicos, conversão e rentabilidade</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin/contratos"
              className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-[#161c2c] hover:bg-[#1f283d] border border-[#232b3e] text-[#94a3b8] hover:text-white"
            >
              Contratos Recorrentes
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-7xl space-y-6">
        {/* Top KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Faturamento Total Projetado */}
          <div className="bg-[#161c2c] rounded-2xl p-6 border border-[#232b3e] shadow-lg">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#94a3b8]">Volume de Projetos</span>
            <h3 className="text-2xl font-bold text-white font-mono mt-1">R$ 380.000</h3>
            <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1 font-semibold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+18.4% vs trimestre anterior</span>
            </p>
          </div>

          {/* Card 2: MRR Contratos Recorrentes */}
          <div className="bg-[#161c2c] rounded-2xl p-6 border border-[#232b3e] shadow-lg">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#94a3b8]">MRR (Receita Recorrente)</span>
            <h3 className="text-2xl font-bold text-emerald-400 font-mono mt-1">
              R$ {metricasRecorrentes.mrr.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês
            </h3>
            <p className="text-xs text-[#94a3b8] mt-2">
              ARR: <strong className="text-white font-mono">R$ {metricasRecorrentes.arr.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>/ano
            </p>
          </div>

          {/* Card 3: Ticket Médio de Projetos */}
          <div className="bg-[#161c2c] rounded-2xl p-6 border border-[#232b3e] shadow-lg">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#94a3b8]">Ticket Médio (Turnkey)</span>
            <h3 className="text-2xl font-bold text-[#fcdc5d] font-mono mt-1">
              R$ {bi.ticketMedioProjetos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </h3>
            <p className="text-xs text-[#94a3b8] mt-2">Engenharia, NR12 e Automação</p>
          </div>

          {/* Card 4: Taxa de Conversão */}
          <div className="bg-[#161c2c] rounded-2xl p-6 border border-[#232b3e] shadow-lg">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#94a3b8]">Conversão Comercial</span>
            <h3 className="text-2xl font-bold text-white font-mono mt-1">{bi.taxaConversaoFinalPct}%</h3>
            <p className="text-xs text-emerald-400 mt-2 font-semibold">
              {bi.taxaQualificacaoPct}% leads qualificados
            </p>
          </div>
        </div>

        {/* Linhas de Serviço & Funil */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Distribuição por Linha de Serviço */}
          <div className="bg-[#161c2c] rounded-2xl p-6 border border-[#232b3e] shadow-lg space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <PieChart className="w-4 h-4 text-[#fcdc5d]" />
              <span>Distribuição de Receita por Linha de Serviço</span>
            </h3>

            <div className="space-y-3.5 pt-2">
              {bi.distribuicaoLinhas.map((item, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-white">{item.linha}</span>
                    <span className="font-mono text-[#fcdc5d]">{item.sharePct}%</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-[#111622] overflow-hidden border border-[#232b3e]">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${item.sharePct}%`, backgroundColor: item.cor }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Funil de Vendas Faísca CRM */}
          <div className="bg-[#161c2c] rounded-2xl p-6 border border-[#232b3e] shadow-lg space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-[#fcdc5d]" />
              <span>Funil de Vendas & Eficiência Comercial</span>
            </h3>

            <div className="space-y-3 pt-2">
              <div className="p-3 rounded-xl bg-[#111622] border border-[#232b3e] flex justify-between items-center text-xs">
                <span className="text-[#94a3b8]">1. Leads Capturados (Faísca PWA):</span>
                <span className="font-mono font-bold text-white">24 leads (100%)</span>
              </div>

              <div className="p-3 rounded-xl bg-[#111622] border border-[#232b3e] flex justify-between items-center text-xs">
                <span className="text-[#94a3b8]">2. Leads Qualificados / Triagem:</span>
                <span className="font-mono font-bold text-purple-400">18 leads (75%)</span>
              </div>

              <div className="p-3 rounded-xl bg-[#111622] border border-[#232b3e] flex justify-between items-center text-xs">
                <span className="text-[#94a3b8]">3. Orçamentos Enviados (3 Cenários):</span>
                <span className="font-mono font-bold text-[#fcdc5d]">12 propostas (50%)</span>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/40 flex justify-between items-center text-xs">
                <span className="font-bold text-white">4. Contratos & OSs Fechadas:</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">8 contratos (33.3%)</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
