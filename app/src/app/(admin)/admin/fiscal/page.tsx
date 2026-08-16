'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  FileText, ArrowLeft, RefreshCw, CheckCircle2, 
  AlertTriangle, ShieldAlert, Send, Download, ExternalLink, Clock
} from 'lucide-react';
import { processarFilaFiscal, type NFItem } from '@/core/financeiro';

const FILA_FISCAL_MOCK: NFItem[] = [
  { id: 'nf-101', os_id: 'os-101', numero: '2026-0091', valor: 20950, status: 'autorizada', tentativas: 1 },
  { id: 'nf-102', os_id: 'os-102', valor: 12400, status: 'fila', tentativas: 0 },
  { id: 'nf-103', os_id: 'os-103', valor: 8900, status: 'rejeitada', tentativas: 3, erro: 'Inscrição Municipal do Tomador inválida junto à Prefeitura' },
];

export default function FiscalPage() {
  const [fila, setFila] = useState<NFItem[]>(FILA_FISCAL_MOCK);
  const [processandoId, setProcessandoId] = useState<string | null>(null);
  const [mensagem, setMensagem] = useState<string | null>(null);

  const handleEmitirOuReprocessar = async (nf: NFItem) => {
    setProcessandoId(nf.id);
    setMensagem(null);

    // Simulação de chamada ao FocusNFe com retry
    setTimeout(() => {
      const sucesso = nf.tentativas < 2; // Simula sucesso nas primeiras tentativas
      const nfAtualizada = processarFilaFiscal(nf, {
        sucesso,
        numero: sucesso ? `2026-${Math.floor(1000 + Math.random() * 9000)}` : undefined,
        erro: sucesso ? undefined : 'Instabilidade temporária no servidor da Prefeitura',
      });

      setFila((prev) => prev.map((item) => (item.id === nf.id ? nfAtualizada : item)));
      setProcessandoId(null);
      setMensagem(sucesso ? '✓ Nota Fiscal Autorizada com Sucesso!' : '⚠ Falha na emissão. Registrado na fila.');
      setTimeout(() => setMensagem(null), 3500);
    }, 1000);
  };

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
              <h1 className="text-lg font-bold font-outfit text-white">Fila Fiscal & FocusNFe</h1>
              <p className="text-xs text-[#94a3b8]">Emissão de NFSe / NFe com retries e contingência</p>
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
      <main className="container mx-auto px-4 py-8 max-w-7xl space-y-6">
        {mensagem && (
          <div className="p-4 rounded-xl bg-[#fcdc5d] text-[#0a0d14] text-xs font-bold text-center">
            {mensagem}
          </div>
        )}

        {/* Resumo do Módulo */}
        <div className="bg-[#161c2c] rounded-2xl p-6 border border-[#232b3e] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-base font-bold text-white">Integração Direta com FocusNFe</h2>
            <p className="text-xs text-[#94a3b8] mt-0.5">
              Fila com retry automático até 3 vezes e contingência manual para notas fiscais de serviço e peças.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono bg-[#111622] px-3.5 py-2 rounded-xl border border-[#232b3e]">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-[#94a3b8]">Ambiente: Homologação / Produção</span>
          </div>
        </div>

        {/* Tabela de Notas Fiscais */}
        <div className="bg-[#161c2c] rounded-2xl border border-[#232b3e] overflow-hidden shadow-xl">
          <div className="p-4 border-b border-[#232b3e] bg-[#111622] flex justify-between items-center">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#fcdc5d]" />
              <span>Notas Fiscais de Ordens de Serviço</span>
            </h3>
            <span className="text-xs text-[#94a3b8]">{fila.length} notas no histórico</span>
          </div>

          <div className="divide-y divide-[#232b3e]">
            {fila.map((nf) => {
              const isProcessando = processandoId === nf.id;

              return (
                <div key={nf.id} className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-[#1b2235] transition-colors">
                  <div>
                    <div className="flex items-center gap-3">
                      <h4 className="font-bold text-white text-sm">
                        {nf.numero ? `NFSe #${nf.numero}` : `Fila de Emissão (${nf.os_id.toUpperCase()})`}
                      </h4>

                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${
                          nf.status === 'autorizada'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : nf.status === 'rejeitada'
                            ? 'bg-red-500/10 text-red-400 border-red-500/30'
                            : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
                        }`}
                      >
                        {nf.status}
                      </span>
                    </div>

                    <p className="text-xs text-[#94a3b8] mt-1">
                      Valor Total: <strong className="text-white font-mono">R$ {nf.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong> · Tentativas: {nf.tentativas}/3
                    </p>

                    {nf.erro && (
                      <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        <span>{nf.erro}</span>
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {nf.status === 'autorizada' ? (
                      <button className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 px-3.5 py-2 rounded-xl transition-all">
                        <Download className="w-3.5 h-3.5" />
                        <span>Baixar XML / PDF</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEmitirOuReprocessar(nf)}
                        disabled={isProcessando}
                        className="flex items-center gap-1.5 text-xs font-bold text-[#0a0d14] bg-[#fcdc5d] hover:bg-[#f5cb3c] px-4 py-2 rounded-xl transition-all shadow disabled:opacity-50"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isProcessando ? 'animate-spin' : ''}`} />
                        <span>{nf.status === 'rejeitada' ? 'Reprocessar em Contingência' : 'Emitir Agora'}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
