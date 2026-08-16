'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  DollarSign, TrendingUp, TrendingDown, ArrowLeft, ArrowUpRight, 
  Clock, ShieldCheck, FileSpreadsheet, PieChart, Wallet, 
  Calendar, CheckCircle2, AlertCircle, Sparkles
} from 'lucide-react';
import { calcularDRE_OS, type DRE_OS_Input } from '@/core/financeiro';

const OS_DRE_MOCK: DRE_OS_Input = {
  os_codigo: 101,
  cliente_nome: 'Cerâmica São Paulo & Cia',
  valor_venda_total: 41900,
  aliquota_imposto_pct: 6, // Anexo III
  horas_proprias: [
    { recurso_nome: 'Maike (Gestão Técnica)', horas: 40, custo_hora: 100, venda_hora: 200 },
    { recurso_nome: 'Kiones (Liderança Operacional)', horas: 80, custo_hora: 60, venda_hora: 120 },
  ],
  horas_terceirizados: [
    { terceiro_nome: '4 Eletricistas Montadores (Freela)', horas: 160, custo_hora_real: 40, venda_hora_cobrada: 80 },
  ],
  materiais: [
    { descricao: 'EPIs, Fita Autofusão e Terminais', custo_compra: 2000, valor_cobrado: 2600 },
  ],
  logistica: {
    km_rodados: 300,
    valor_km: 2.0,
    alimentacao_dias: 15,
    valor_diaria_alimentacao: 70,
  },
  custo_bdi_rateio: 1500,
};

export default function FinanceiroPage() {
  const [osSelecionada, setOsSelecionada] = useState<DRE_OS_Input>(OS_DRE_MOCK);
  const [abaAtiva, setAbaAtiva] = useState<'dre' | 'contas' | 'caixa'>('dre');

  const dre = calcularDRE_OS(osSelecionada);

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
              <h1 className="text-lg font-bold font-outfit text-white">Módulo Financeiro & DRE</h1>
              <p className="text-xs text-[#94a3b8]">Demonstrativo de Resultado por OS, Contas e Fluxo de Caixa</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin/fiscal"
              className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-[#161c2c] hover:bg-[#1f283d] border border-[#232b3e] text-[#94a3b8] hover:text-white"
            >
              Fila Fiscal FocusNFe
            </Link>
            <Link
              href="/admin/suprimentos"
              className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-[#161c2c] hover:bg-[#1f283d] border border-[#232b3e] text-[#94a3b8] hover:text-white"
            >
              Suprimentos & Estoque
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-3 mb-8 border-b border-[#232b3e] pb-4">
          <button
            onClick={() => setAbaAtiva('dre')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              abaAtiva === 'dre'
                ? 'bg-[#fcdc5d] text-[#0a0d14]'
                : 'bg-[#161c2c] text-[#94a3b8] hover:text-white border border-[#232b3e]'
            }`}
          >
            DRE Analítico por OS
          </button>
          <button
            onClick={() => setAbaAtiva('contas')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              abaAtiva === 'contas'
                ? 'bg-[#fcdc5d] text-[#0a0d14]'
                : 'bg-[#161c2c] text-[#94a3b8] hover:text-white border border-[#232b3e]'
            }`}
          >
            Contas a Receber / Pagar
          </button>
          <button
            onClick={() => setAbaAtiva('caixa')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              abaAtiva === 'caixa'
                ? 'bg-[#fcdc5d] text-[#0a0d14]'
                : 'bg-[#161c2c] text-[#94a3b8] hover:text-white border border-[#232b3e]'
            }`}
          >
            Projeção de Caixa 30/60/90
          </button>
        </div>

        {/* ABA 1: DRE Analítico por OS */}
        {abaAtiva === 'dre' && (
          <div className="space-y-6">
            {/* Resumo da OS */}
            <div className="bg-[#161c2c] rounded-2xl p-6 border border-[#232b3e] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#94a3b8]">
                  Demonstrativo da OS #{dre.os_codigo}
                </span>
                <h2 className="text-xl font-bold text-white mt-0.5">{dre.cliente_nome}</h2>
              </div>

              <div className="flex items-center gap-6">
                <div>
                  <p className="text-[11px] text-[#94a3b8]">Receita Bruta</p>
                  <p className="text-xl font-bold text-white font-mono">
                    R$ {dre.receita_bruta.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>

                <div className="pl-6 border-l border-[#232b3e]">
                  <p className="text-[11px] text-[#94a3b8]">Lucro Líquido</p>
                  <p className="text-xl font-bold text-emerald-400 font-mono">
                    R$ {dre.lucro_liquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>

                <div className="pl-6 border-l border-[#232b3e]">
                  <p className="text-[11px] text-[#94a3b8]">Margem Real</p>
                  <p className="text-xl font-bold text-[#fcdc5d] font-mono">
                    {dre.margem_lucro_pct}%
                  </p>
                </div>
              </div>
            </div>

            {/* Destaque: Lucro Hora Terceirizada (Seção 7.6) */}
            <div className="bg-gradient-to-r from-emerald-950/40 via-[#161c2c] to-[#161c2c] border border-emerald-500/30 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">Lucro sobre Horas Terceirizadas</h3>
                    <p className="text-xs text-[#94a3b8]">
                      Delta transparente entre a venda do Homem-Hora ao cliente vs custo pago aos terceiros
                    </p>
                  </div>
                </div>

                <span className="text-lg font-bold text-emerald-400 font-mono bg-emerald-500/10 px-3.5 py-1.5 rounded-xl border border-emerald-500/30">
                  + R$ {dre.lucro_hora_terceirizada.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#232b3e] text-xs">
                <div>
                  <span className="text-[#94a3b8]">Valor Vendido (Terceiros):</span>
                  <p className="font-bold text-white font-mono mt-0.5">
                    R$ {dre.venda_terceirizados_total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div>
                  <span className="text-[#94a3b8]">Custo Real Pago (Freelas):</span>
                  <p className="font-bold text-red-300 font-mono mt-0.5">
                    - R$ {dre.custo_terceirizados_total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div>
                  <span className="text-[#94a3b8]">Margem Bruta sobre Freela:</span>
                  <p className="font-bold text-emerald-400 font-mono mt-0.5">
                    50.0% de margem
                  </p>
                </div>
              </div>
            </div>

            {/* Tabela do DRE Completo */}
            <div className="bg-[#161c2c] rounded-2xl border border-[#232b3e] overflow-hidden shadow-lg">
              <div className="p-4 border-b border-[#232b3e] bg-[#111622] flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-[#fcdc5d]" />
                  <span>Estrutura Detalhada do DRE</span>
                </h3>
                <span className="text-xs text-[#94a3b8]">Imposto: Simples Nacional 6.0%</span>
              </div>

              <div className="divide-y divide-[#232b3e] text-xs">
                <div className="p-4 flex justify-between items-center bg-[#111622]/40 font-bold text-white">
                  <span>(+) RECEITA BRUTA DE SERVIÇOS</span>
                  <span className="font-mono text-sm">R$ {dre.receita_bruta.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>

                <div className="p-4 flex justify-between items-center text-red-300">
                  <span className="pl-4">(-) Impostos Fiscais (Simples Nacional)</span>
                  <span className="font-mono">- R$ {dre.impostos_valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>

                <div className="p-4 flex justify-between items-center bg-[#111622]/20 font-semibold text-white">
                  <span>(=) RECEITA LÍQUIDA OPERACIONAL</span>
                  <span className="font-mono">R$ {dre.receita_liquida.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>

                <div className="p-4 flex justify-between items-center text-[#94a3b8]">
                  <span className="pl-4">(-) Mão de Obra Própria (Kiones / Maike / Dioleno)</span>
                  <span className="font-mono text-red-300">- R$ {dre.custo_mao_obra_propria.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>

                <div className="p-4 flex justify-between items-center text-[#94a3b8]">
                  <span className="pl-4">(-) Mão de Obra Terceirizada (Freelas)</span>
                  <span className="font-mono text-red-300">- R$ {dre.custo_terceirizados_total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>

                <div className="p-4 flex justify-between items-center text-[#94a3b8]">
                  <span className="pl-4">(-) Materiais e Insumos</span>
                  <span className="font-mono text-red-300">- R$ {dre.custo_materiais_total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>

                <div className="p-4 flex justify-between items-center text-[#94a3b8]">
                  <span className="pl-4">(-) Logística (Km rodados + Alimentação)</span>
                  <span className="font-mono text-red-300">- R$ {dre.custo_logistica_total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>

                <div className="p-4 flex justify-between items-center text-[#94a3b8]">
                  <span className="pl-4">(-) Rateio Administrativo BDI</span>
                  <span className="font-mono text-red-300">- R$ {dre.custo_bdi_total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>

                <div className="p-5 flex justify-between items-center bg-[#111622] font-bold text-white text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>(=) LUCRO LÍQUIDO FINAL DA OS</span>
                  </div>
                  <span className="font-mono text-emerald-400 text-base">
                    R$ {dre.lucro_liquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} ({dre.margem_lucro_pct}%)
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ABA 2: Contas a Receber / Pagar */}
        {abaAtiva === 'contas' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* A Receber */}
            <div className="bg-[#161c2c] rounded-2xl p-6 border border-[#232b3e] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#232b3e]">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span>Contas a Receber</span>
                </h3>
                <span className="text-xs font-mono text-emerald-400 font-bold">R$ 53.900,00</span>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-[#111622] border border-[#232b3e] flex justify-between items-center text-xs">
                  <div>
                    <p className="font-bold text-white">Cerâmica São Paulo (OS #101 - Parcela 1)</p>
                    <p className="text-[11px] text-[#94a3b8]">Vencimento: 25/08/2026</p>
                  </div>
                  <span className="font-mono font-bold text-white">R$ 20.950,00</span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#111622] border border-[#232b3e] flex justify-between items-center text-xs">
                  <div>
                    <p className="font-bold text-white">Cerâmica São Paulo (OS #101 - Parcela 2)</p>
                    <p className="text-[11px] text-[#94a3b8]">Vencimento: 25/09/2026</p>
                  </div>
                  <span className="font-mono font-bold text-white">R$ 20.950,00</span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#111622] border border-[#232b3e] flex justify-between items-center text-xs">
                  <div>
                    <p className="font-bold text-white">PEU Manutenção Recorrente</p>
                    <p className="text-[11px] text-[#94a3b8]">Vencimento: 05/09/2026</p>
                  </div>
                  <span className="font-mono font-bold text-emerald-400">R$ 1.200,00</span>
                </div>
              </div>
            </div>

            {/* A Pagar */}
            <div className="bg-[#161c2c] rounded-2xl p-6 border border-[#232b3e] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#232b3e]">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-red-400" />
                  <span>Contas a Pagar</span>
                </h3>
                <span className="text-xs font-mono text-red-400 font-bold">R$ 14.850,00</span>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-[#111622] border border-[#232b3e] flex justify-between items-center text-xs">
                  <div>
                    <p className="font-bold text-white">4 Eletricistas Freela (OS #101)</p>
                    <p className="text-[11px] text-[#94a3b8]">Vencimento: 20/08/2026</p>
                  </div>
                  <span className="font-mono font-bold text-red-300">R$ 6.400,00</span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#111622] border border-[#232b3e] flex justify-between items-center text-xs">
                  <div>
                    <p className="font-bold text-white">Distribuidora Elétrica (Insumos OS #101)</p>
                    <p className="text-[11px] text-[#94a3b8]">Vencimento: 30/08/2026</p>
                  </div>
                  <span className="font-mono font-bold text-red-300">R$ 2.000,00</span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#111622] border border-[#232b3e] flex justify-between items-center text-xs">
                  <div>
                    <p className="font-bold text-white">Custo Fixo Galpão / Infraestrutura MDK</p>
                    <p className="text-[11px] text-[#94a3b8]">Vencimento: 10/09/2026</p>
                  </div>
                  <span className="font-mono font-bold text-red-300">R$ 4.500,00</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ABA 3: Projeção de Caixa */}
        {abaAtiva === 'caixa' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#161c2c] rounded-2xl p-6 border border-[#232b3e]">
              <span className="text-[10px] font-mono uppercase text-[#94a3b8]">Horizonte 30 Dias</span>
              <h3 className="text-2xl font-bold text-emerald-400 font-mono mt-1">+ R$ 39.050,00</h3>
              <p className="text-xs text-[#94a3b8] mt-2">Saldo líquido projetado com entradas da OS #101 e recorrentes.</p>
            </div>

            <div className="bg-[#161c2c] rounded-2xl p-6 border border-[#232b3e]">
              <span className="text-[10px] font-mono uppercase text-[#94a3b8]">Horizonte 60 Dias</span>
              <h3 className="text-2xl font-bold text-emerald-400 font-mono mt-1">+ R$ 60.000,00</h3>
              <p className="text-xs text-[#94a3b8] mt-2">Segunda parcela de projetos industriais e novos contratos.</p>
            </div>

            <div className="bg-[#161c2c] rounded-2xl p-6 border border-[#232b3e]">
              <span className="text-[10px] font-mono uppercase text-[#94a3b8]">Horizonte 90 Dias</span>
              <h3 className="text-2xl font-bold text-emerald-400 font-mono mt-1">+ R$ 85.000,00</h3>
              <p className="text-xs text-[#94a3b8] mt-2">Previsão com esteira comercial Faísca e conversão de propostas.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
