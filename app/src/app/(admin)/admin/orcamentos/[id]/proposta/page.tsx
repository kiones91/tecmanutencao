'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Printer, ArrowLeft } from 'lucide-react';

// Mock de dados (será substituído por fetch do Supabase)
const orcamentoMock = {
  codigo: 1001,
  cliente_nome: 'Indústria Metalúrgica Silva',
  linha_servico: 'NR12 Turnkey',
  modo: 'fechado' as const,
  valor_total: 29500,
  validade_dias: 7,
  premissas: 'Orçamento baseado em máquina média industrial. Visita técnica para levantamento detalhado.',
  exclusoes: 'Não inclui reformas civis, adequações de rede elétrica geral ou substituição de máquina.',
  itens: [
    { descricao: 'Engenharia e Projeto NR12', venda_total: 7500 },
    { descricao: 'Montagem e Adequação', venda_total: 5600 },
    { descricao: 'Materiais NR12', venda_total: 10400 },
    { descricao: 'ART (2× R$ 120)', venda_total: 240 },
    { descricao: 'Logística', venda_total: 600 },
    { descricao: 'Custo Administrativo (BDI)', venda_total: 2406.25 },
  ],
};

export default function PropostaPage() {
  const params = useParams();
  const [imprimindo, setImprimindo] = useState(false);

  const handlePrint = () => {
    setImprimindo(true);
    window.print();
    setImprimindo(false);
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho - Não aparece na impressão */}
      <div className="flex items-center justify-between print:hidden">
        <Link
          href={`/admin/orcamentos/${params.id}`}
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar
        </Link>
        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#fcdc5d] hover:bg-[#f5cb3c] text-[#0a0d14] font-semibold rounded-lg transition-all min-h-[48px]"
        >
          <Printer className="w-5 h-5" />
          Imprimir / Salvar PDF
        </button>
      </div>

      {/* Proposta - Layout de Impressão */}
      <div className="bg-white text-[#0a0d14] rounded-xl p-8 print:p-0 print:rounded-none print:shadow-none">
        {/* Cabeçalho da Proposta */}
        <div className="border-b-2 border-[#fcdc5d] pb-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#0a0d14]">PROPOSTA COMERCIAL</h1>
              <p className="text-sm text-gray-600 mt-1">TecManutenções Engenharia e Automação Industrial</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold">Orçamento #{orcamentoMock.codigo.toString().padStart(4, '0')}</p>
              <p className="text-sm text-gray-600">Validade: {orcamentoMock.validade_dias} dias</p>
            </div>
          </div>
        </div>

        {/* Dados do Cliente */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-[#0a0d14] mb-2">CLIENTE</h2>
          <p className="text-base">{orcamentoMock.cliente_nome}</p>
          <p className="text-sm text-gray-600 mt-1">Serviço: {orcamentoMock.linha_servico}</p>
        </div>

        {/* Escopo - Modo Fechado */}
        {orcamentoMock.modo === 'fechado' && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-[#0a0d14] mb-4">ESCOPO DO SERVIÇO</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-base leading-relaxed">
                <strong>Serviço Turnkey Completo:</strong> Regularização NR12 com engenharia, 
                montagem, materiais e laudo técnico. Valor único para execução completa do escopo descrito.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-gray-700">
                {orcamentoMock.itens.map((item, idx) => (
                  <li key={idx} className="flex justify-between">
                    <span>{item.descricao}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Premissas */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-[#0a0d14] mb-2">PREMISSAS</h2>
          <p className="text-sm text-gray-700">{orcamentoMock.premissas}</p>
        </div>

        {/* Exclusões */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-[#0a0d14] mb-2">EXCLUSÕES</h2>
          <p className="text-sm text-gray-700">{orcamentoMock.exclusoes}</p>
        </div>

        {/* Investimento */}
        <div className="bg-[#fcdc5d]/20 border-2 border-[#fcdc5d] rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-700">INVESTIMENTO TOTAL</p>
              <p className="text-xs text-gray-600 mt-1">Valor único turnkey com todos os itens descritos</p>
            </div>
            <p className="text-3xl font-bold text-[#0a0d14]">
              R$ {orcamentoMock.valor_total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {/* Termo de Garantia */}
        <div className="border-t pt-6 mb-8">
          <h2 className="text-lg font-bold text-[#0a0d14] mb-2">TERMO DE GARANTIA</h2>
          <p className="text-sm text-gray-700">
            Todos os serviços executados possuem garantia de 90 dias conforme Código de Defesa do Consumidor.
            A garantia cobre defeitos de execução, não se aplicando a danos por mau uso, fatores externos 
            ou desgaste natural.
          </p>
        </div>

        {/* Assinaturas */}
        <div className="grid grid-cols-2 gap-8 mt-12 pt-8 border-t">
          <div className="text-center">
            <div className="h-20 border-b border-gray-400 mb-2"></div>
            <p className="text-sm font-semibold">TecManutenções</p>
            <p className="text-xs text-gray-600">Responsável Técnico</p>
          </div>
          <div className="text-center">
            <div className="h-20 border-b border-gray-400 mb-2"></div>
            <p className="text-sm font-semibold">Cliente</p>
            <p className="text-xs text-gray-600">{orcamentoMock.cliente_nome}</p>
          </div>
        </div>

        {/* Rodapé */}
        <div className="mt-12 pt-6 border-t text-center text-xs text-gray-500">
          <p>TecManutenções Engenharia e Automação Industrial</p>
          <p className="mt-1">Documento gerado em {new Date().toLocaleDateString('pt-BR')}</p>
        </div>
      </div>

      {/* CSS de Impressão */}
      <style jsx global>{`
        @media print {
          body { 
            background: white !important; 
            -webkit-print-color-adjust: exact; 
            print-color-adjust: exact;
          }
          .print\\:hidden { display: none !important; }
          .print\\:p-0 { padding: 0 !important; }
          .print\\:rounded-none { border-radius: 0 !important; }
          .print\\:shadow-none { box-shadow: none !important; }
        }
      `}</style>
    </div>
  );
}
