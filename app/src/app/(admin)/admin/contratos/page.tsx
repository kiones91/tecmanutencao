'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Users, Repeat, ArrowLeft, Plus, CheckCircle2, 
  Clock, ShieldCheck, AlertCircle, Sparkles, Building, 
  ArrowRight, Phone, DollarSign, Calendar
} from 'lucide-react';
import { 
  CONTRATOS_ATIVOS_INICIAIS, 
  PROSPECCOES_INICIAIS, 
  calcularMetricasRecorrentes, 
  calcularPipelineVendas,
  type ContratoRecorrente,
  type OportunidadeProspeccao 
} from '@/core/bi-contratos';

export default function ContratosPage() {
  const [contratos, setContratos] = useState<ContratoRecorrente[]>(CONTRATOS_ATIVOS_INICIAIS);
  const [prospeccoes, setProspeccoes] = useState<OportunidadeProspeccao[]>(PROSPECCOES_INICIAIS);
  const [abaAtiva, setAbaAtiva] = useState<'ativos' | 'pipeline'>('ativos');

  const metricas = calcularMetricasRecorrentes(contratos);
  const pipeline = calcularPipelineVendas(prospeccoes);

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
              <h1 className="text-lg font-bold font-outfit text-white">Contratos Recorrentes & Prospecção</h1>
              <p className="text-xs text-[#94a3b8]">Base ativa (ativos.md) e esteira de novos negócios</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin/bi"
              className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-[#161c2c] hover:bg-[#1f283d] border border-[#232b3e] text-[#94a3b8] hover:text-white"
            >
              BI & Analytics
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-7xl space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-[#161c2c] rounded-2xl p-6 border border-[#232b3e]">
            <span className="text-[10px] font-semibold uppercase text-[#94a3b8]">Contratos Ativos</span>
            <h3 className="text-2xl font-bold text-white font-mono mt-1">{metricas.totalContratosAtivos} clientes</h3>
            <p className="text-xs text-[#94a3b8] mt-2">Manutenção preventiva mensal</p>
          </div>

          <div className="bg-[#161c2c] rounded-2xl p-6 border border-[#232b3e]">
            <span className="text-[10px] font-semibold uppercase text-[#94a3b8]">MRR (Mensalidade Total)</span>
            <h3 className="text-2xl font-bold text-emerald-400 font-mono mt-1">
              R$ {metricas.mrr.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </h3>
            <p className="text-xs text-[#94a3b8] mt-2">Ticket médio: R$ {metricas.ticketMedio.toFixed(2)}</p>
          </div>

          <div className="bg-[#161c2c] rounded-2xl p-6 border border-[#232b3e]">
            <span className="text-[10px] font-semibold uppercase text-[#94a3b8]">Pipeline Bruto (Prospecções)</span>
            <h3 className="text-2xl font-bold text-[#fcdc5d] font-mono mt-1">
              R$ {pipeline.totalPipelineBruto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </h3>
            <p className="text-xs text-[#94a3b8] mt-2">{pipeline.totalOportunidades} clientes em contato</p>
          </div>

          <div className="bg-[#161c2c] rounded-2xl p-6 border border-[#232b3e]">
            <span className="text-[10px] font-semibold uppercase text-[#94a3b8]">Pipeline Ponderado</span>
            <h3 className="text-2xl font-bold text-teal-400 font-mono mt-1">
              R$ {pipeline.totalPipelinePonderado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </h3>
            <p className="text-xs text-[#94a3b8] mt-2">Ponderado por probabilidade</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-3 border-b border-[#232b3e] pb-4">
          <button
            onClick={() => setAbaAtiva('ativos')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              abaAtiva === 'ativos'
                ? 'bg-[#fcdc5d] text-[#0a0d14]'
                : 'bg-[#161c2c] text-[#94a3b8] hover:text-white border border-[#232b3e]'
            }`}
          >
            Clientes Ativos ({contratos.length})
          </button>
          <button
            onClick={() => setAbaAtiva('pipeline')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              abaAtiva === 'pipeline'
                ? 'bg-[#fcdc5d] text-[#0a0d14]'
                : 'bg-[#161c2c] text-[#94a3b8] hover:text-white border border-[#232b3e]'
            }`}
          >
            Pipeline de Prospecções ({prospeccoes.length})
          </button>
        </div>

        {/* ABA 1: Contratos Ativos */}
        {abaAtiva === 'ativos' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {contratos.map((c) => (
              <div key={c.id} className="bg-[#161c2c] rounded-2xl p-6 border border-[#232b3e] shadow-lg flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-white leading-snug">{c.cliente_nome}</h3>
                      <span className="text-xs text-[#94a3b8] capitalize">{c.tipo} · SLA {c.sla_horas_atendimento}h</span>
                    </div>

                    <span className="text-sm font-bold font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/30">
                      R$ {c.valor_mensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/mês
                    </span>
                  </div>

                  <p className="text-xs text-[#94a3b8] mt-3 leading-relaxed">
                    {c.escopo_resumo}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#232b3e] flex items-center justify-between text-xs text-[#94a3b8]">
                  <span>Vencimento: Dia {c.dia_vencimento}</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Próx. Preventiva: {c.proxima_preventiva}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ABA 2: Pipeline de Prospecções */}
        {abaAtiva === 'pipeline' && (
          <div className="space-y-4">
            {prospeccoes.map((p) => (
              <div key={p.id} className="bg-[#161c2c] rounded-2xl p-5 border border-[#232b3e] flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-[#3b4764] transition-all">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-base font-bold text-white">{p.cliente_nome}</h3>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/30 uppercase">
                      {p.estagio.replace('_', ' ')}
                    </span>
                  </div>

                  <p className="text-xs text-[#94a3b8] mt-1">
                    Contato: <strong className="text-white">{p.contato_responsavel}</strong> · {p.observacoes}
                  </p>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <span className="text-[10px] text-[#94a3b8] uppercase">Valor Estimado</span>
                    <p className="font-mono font-bold text-white text-base">
                      R$ {p.valor_estimado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-[#94a3b8] uppercase">Probabilidade</span>
                    <p className="font-mono font-bold text-[#fcdc5d] text-base">
                      {p.probabilidade_pct}%
                    </p>
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
