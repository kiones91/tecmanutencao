'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Package, ShoppingCart, ArrowLeft, CheckCircle2, 
  Sparkles, Truck, Clock, AlertTriangle, Plus, ArrowRight
} from 'lucide-react';
import { avaliarCotacoes, type CotacaoFornecedor } from '@/core/financeiro';

const COTACOES_INICIAIS: CotacaoFornecedor[] = [
  {
    id: 'cot-1',
    fornecedor_nome: 'Eletro Peças Rio Claro',
    descricao: 'Disjuntores Caixa Moldada 150A + Relés de Segurança NR12',
    valor_produtos: 8500,
    frete: 300,
    prazo_dias: 10,
    condicao_pagamento: '28 dias',
  },
  {
    id: 'cot-2',
    fornecedor_nome: 'Distribuidora Industrial Campinas (Pronta Entrega)',
    descricao: 'Disjuntores Caixa Moldada 150A + Relés de Segurança NR12',
    valor_produtos: 8600,
    frete: 150,
    prazo_dias: 2,
    condicao_pagamento: '30 dias',
  },
  {
    id: 'cot-3',
    fornecedor_nome: 'Automação Brasil Express',
    descricao: 'Disjuntores Caixa Moldada 150A + Relés de Segurança NR12',
    valor_produtos: 8900,
    frete: 200,
    prazo_dias: 5,
    condicao_pagamento: 'À vista com 5%',
  },
];

interface InsumoEstoque {
  id: string;
  nome: string;
  unidade: string;
  saldo_atual: number;
  estoque_min: number;
  custo_medio: number;
}

const INSUMOS_MOCK: InsumoEstoque[] = [
  { id: '1', nome: 'Fita Autofusão 3M 19mm x 10m', unidade: 'rolo', saldo_atual: 18, estoque_min: 10, custo_medio: 28.5 },
  { id: '2', nome: 'Terminal Tubular Ilhós 2.5mm', unidade: 'cento', saldo_atual: 4, estoque_min: 8, custo_medio: 14.0 },
  { id: '3', nome: 'Disjuntor Bipolar 20A Curva C', unidade: 'un', saldo_atual: 12, estoque_min: 5, custo_medio: 32.0 },
  { id: '4', nome: 'Cabo Flexível 50mm 1kV', unidade: 'metro', saldo_atual: 45, estoque_min: 100, custo_medio: 48.0 },
];

export default function SuprimentosPage() {
  const [cotacoes, setCotacoes] = useState<CotacaoFornecedor[]>(COTACOES_INICIAIS);
  const [insumos, setInsumos] = useState<InsumoEstoque[]>(INSUMOS_MOCK);
  const [abaAtiva, setAbaAtiva] = useState<'cotacoes' | 'estoque'>('cotacoes');

  const cotacoesAvaliadas = avaliarCotacoes(cotacoes) || [];

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
              <h1 className="text-lg font-bold font-outfit text-white">Suprimentos & Estoque Flutuante</h1>
              <p className="text-xs text-[#94a3b8]">Comparador inteligente de cotações e controle de insumos</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin/financeiro"
              className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-[#161c2c] hover:bg-[#1f283d] border border-[#232b3e] text-[#94a3b8] hover:text-white"
            >
              Painel Financeiro
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-3 mb-8 border-b border-[#232b3e] pb-4">
          <button
            onClick={() => setAbaAtiva('cotacoes')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              abaAtiva === 'cotacoes'
                ? 'bg-[#fcdc5d] text-[#0a0d14]'
                : 'bg-[#161c2c] text-[#94a3b8] hover:text-white border border-[#232b3e]'
            }`}
          >
            Comparador de Cotações
          </button>
          <button
            onClick={() => setAbaAtiva('estoque')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              abaAtiva === 'estoque'
                ? 'bg-[#fcdc5d] text-[#0a0d14]'
                : 'bg-[#161c2c] text-[#94a3b8] hover:text-white border border-[#232b3e]'
            }`}
          >
            Estoque Flutuante de Insumos
          </button>
        </div>

        {/* ABA 1: Cotações */}
        {abaAtiva === 'cotacoes' && (
          <div className="space-y-6">
            <div className="bg-[#161c2c] rounded-2xl p-6 border border-[#232b3e] flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white">Cotações da OS #101 (Adequação NR12)</h2>
                <p className="text-xs text-[#94a3b8]">
                  O algoritmo pondera menor custo total (produtos + frete) com agilidade no prazo de entrega da obra.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {cotacoesAvaliadas.map((c) => {
                return (
                  <div
                    key={c.id}
                    className={`rounded-2xl p-6 border transition-all flex flex-col justify-between shadow-xl ${
                      c.melhor
                        ? 'bg-gradient-to-b from-emerald-950/40 to-[#161c2c] border-emerald-500 ring-2 ring-emerald-500/20'
                        : 'bg-[#161c2c] border-[#232b3e]'
                    }`}
                  >
                    <div>
                      {c.melhor && (
                        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30 w-fit mb-3 uppercase tracking-wider">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Melhor Custo-Benefício</span>
                        </div>
                      )}

                      <h3 className="font-bold text-white text-base leading-tight mb-1">{c.fornecedor_nome}</h3>
                      <p className="text-xs text-[#94a3b8] mb-4 line-clamp-2">{c.descricao}</p>

                      <div className="space-y-2 pt-3 border-t border-[#232b3e] text-xs">
                        <div className="flex justify-between">
                          <span className="text-[#94a3b8]">Produtos:</span>
                          <span className="font-mono text-white">
                            R$ {c.valor_produtos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#94a3b8]">Frete:</span>
                          <span className="font-mono text-white">
                            R$ {c.frete.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-emerald-400 font-semibold pt-1 border-t border-[#232b3e]/60">
                          <span>Prazo de Entrega:</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {c.prazo_dias} dias úteis
                          </span>
                        </div>
                        <div className="flex justify-between items-center pt-2 font-bold text-sm text-white">
                          <span>Custo Total:</span>
                          <span className="font-mono text-[#fcdc5d]">
                            R$ {c.custoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-[#232b3e]">
                      <button
                        className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                          c.melhor
                            ? 'bg-emerald-500 hover:bg-emerald-400 text-[#0a0d14] shadow-lg shadow-emerald-500/20'
                            : 'bg-[#111622] hover:bg-[#1f283d] text-[#94a3b8] border border-[#232b3e]'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{c.melhor ? 'Aprovar Cotação Vencedora' : 'Selecionar Esta'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ABA 2: Estoque Flutuante */}
        {abaAtiva === 'estoque' && (
          <div className="space-y-6">
            <div className="bg-[#161c2c] rounded-2xl border border-[#232b3e] overflow-hidden shadow-xl">
              <div className="p-4 border-b border-[#232b3e] bg-[#111622] flex justify-between items-center">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Package className="w-4 h-4 text-[#fcdc5d]" />
                  <span>Posição de Estoque de Insumos</span>
                </h3>
                <span className="text-xs text-[#94a3b8]">4 itens cadastrados</span>
              </div>

              <div className="divide-y divide-[#232b3e]">
                {insumos.map((i) => {
                  const abaixoDoMinimo = i.saldo_atual < i.estoque_min;

                  return (
                    <div key={i.id} className="p-4 flex items-center justify-between text-xs hover:bg-[#1b2235] transition-colors">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-white text-sm">{i.nome}</h4>
                          {abaixoDoMinimo && (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/30 uppercase">
                              <AlertTriangle className="w-3 h-3" />
                              Abaixo do Mínimo
                            </span>
                          )}
                        </div>
                        <p className="text-[#94a3b8] mt-0.5">
                          Unidade: {i.unidade} · Custo Médio: R$ {i.custo_medio.toFixed(2)}
                        </p>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <span className="text-[#94a3b8] text-[11px]">Saldo Disponível</span>
                          <p className={`font-mono text-base font-bold ${abaixoDoMinimo ? 'text-red-400' : 'text-emerald-400'}`}>
                            {i.saldo_atual} {i.unidade}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-[#94a3b8] text-[11px]">Mínimo Seguro</span>
                          <p className="font-mono text-sm text-white">
                            {i.estoque_min} {i.unidade}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
