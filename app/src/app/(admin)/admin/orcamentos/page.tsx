'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, Filter, FileText, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

// Tipos de status do orçamento
type StatusOrcamento = 
  | 'rascunho' 
  | 'revisao' 
  | 'aprovado_interno' 
  | 'enviado' 
  | 'aceito' 
  | 'recusado' 
  | 'expirado' 
  | 'convertido';

interface Orcamento {
  id: string;
  codigo: number;
  cliente_nome: string;
  linha_servico: string;
  status: StatusOrcamento;
  modo: 'fechado' | 'aberto';
  valor_total: number;
  validade_dias: number;
  criado_em: string;
}

const statusConfig: Record<StatusOrcamento, { label: string; color: string; icon: React.ReactNode }> = {
  rascunho: { label: 'Rascunho', color: 'bg-gray-500/20 text-gray-400', icon: <FileText className="w-3 h-3" /> },
  revisao: { label: 'Revisão', color: 'bg-yellow-500/20 text-yellow-400', icon: <AlertTriangle className="w-3 h-3" /> },
  aprovado_interno: { label: 'Aprovado Interno', color: 'bg-green-500/20 text-green-400', icon: <CheckCircle className="w-3 h-3" /> },
  enviado: { label: 'Enviado', color: 'bg-blue-500/20 text-blue-400', icon: <Clock className="w-3 h-3" /> },
  aceito: { label: 'Aceito', color: 'bg-emerald-500/20 text-emerald-400', icon: <CheckCircle className="w-3 h-3" /> },
  recusado: { label: 'Recusado', color: 'bg-red-500/20 text-red-400', icon: <XCircle className="w-3 h-3" /> },
  expirado: { label: 'Expirado', color: 'bg-orange-500/20 text-orange-400', icon: <Clock className="w-3 h-3" /> },
  convertido: { label: 'Convertido', color: 'bg-purple-500/20 text-purple-400', icon: <CheckCircle className="w-3 h-3" /> },
};

// Dados mockados para desenvolvimento (será substituído por Supabase)
const orcamentosMock: Orcamento[] = [
  {
    id: '1',
    codigo: 1001,
    cliente_nome: 'Indústria Metalúrgica Silva',
    linha_servico: 'NR12 Turnkey',
    status: 'aprovado_interno',
    modo: 'fechado',
    valor_total: 29500,
    validade_dias: 7,
    criado_em: '2025-01-15T10:30:00Z',
  },
  {
    id: '2',
    codigo: 1002,
    cliente_nome: 'Fábrica Têxtil Norte',
    linha_servico: 'Automação / Retrofit',
    status: 'revisao',
    modo: 'fechado',
    valor_total: 75000,
    validade_dias: 10,
    criado_em: '2025-01-14T14:20:00Z',
  },
  {
    id: '3',
    codigo: 1003,
    cliente_nome: 'Química Brasil Ltda',
    linha_servico: 'Parada Programada',
    status: 'enviado',
    modo: 'fechado',
    valor_total: 41900,
    validade_dias: 5,
    criado_em: '2025-01-13T09:15:00Z',
  },
  {
    id: '4',
    codigo: 1004,
    cliente_nome: 'Condomínio Empresarial Park',
    linha_servico: 'Predial / Industrial Base',
    status: 'aceito',
    modo: 'fechado',
    valor_total: 8500,
    validade_dias: 7,
    criado_em: '2025-01-12T16:45:00Z',
  },
];

export default function ListaOrcamentosPage() {
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>(orcamentosMock);
  const [filtroStatus, setFiltroStatus] = useState<StatusOrcamento | 'todos'>('todos');
  const [busca, setBusca] = useState('');
  const [carregando, setCarregando] = useState(true);

  // Simula carregamento inicial (será substituído por fetch do Supabase)
  useEffect(() => {
    const timer = setTimeout(() => setCarregando(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Filtra orcamentos
  const orcamentosFiltrados = orcamentos.filter(orc => {
    const matchStatus = filtroStatus === 'todos' || orc.status === filtroStatus;
    const matchBusca = 
      orc.cliente_nome.toLowerCase().includes(busca.toLowerCase()) ||
      orc.linha_servico.toLowerCase().includes(busca.toLowerCase()) ||
      orc.codigo.toString().includes(busca);
    return matchStatus && matchBusca;
  });

  const totalOrcamentos = orcamentosFiltrados.length;
  const valorTotalFiltrado = orcamentosFiltrados.reduce((sum, o) => sum + o.valor_total, 0);

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Orçamentos</h1>
          <p className="text-sm text-slate-400 mt-1">
            Gerencie propostas comerciais da TecManutenções
          </p>
        </div>
        <Link
          href="/admin/orcamentos/novo"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#fcdc5d] hover:bg-[#f5cb3c] text-[#0a0d14] font-semibold rounded-lg transition-all duration-200 min-h-[48px]"
        >
          <Plus className="w-5 h-5" />
          Novo Orçamento
        </Link>
      </div>

      {/* Filtros e Busca */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por cliente, serviço ou código..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#161c2c] border border-[#232b3e] rounded-lg text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#fcdc5d]/50 focus:border-transparent transition-all min-h-[48px]"
          />
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
          <Filter className="w-5 h-5 text-slate-400 flex-shrink-0" />
          <button
            onClick={() => setFiltroStatus('todos')}
            className={cn(
              'px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-all min-h-[40px]',
              filtroStatus === 'todos'
                ? 'bg-[#fcdc5d] text-[#0a0d14]'
                : 'bg-[#161c2c] text-slate-400 hover:text-white hover:bg-[#1f2937]'
            )}
          >
            Todos
          </button>
          {(Object.keys(statusConfig) as StatusOrcamento[]).map((status) => (
            <button
              key={status}
              onClick={() => setFiltroStatus(status)}
              className={cn(
                'px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-all min-h-[40px]',
                filtroStatus === status
                  ? 'bg-[#fcdc5d] text-[#0a0d14]'
                  : 'bg-[#161c2c] text-slate-400 hover:text-white hover:bg-[#1f2937]'
              )}
            >
              {statusConfig[status].label}
            </button>
          ))}
        </div>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#161c2c] border border-[#232b3e] rounded-xl p-4">
          <p className="text-sm text-slate-400">Total de Orçamentos</p>
          <p className="text-2xl font-bold text-white mt-1">{totalOrcamentos}</p>
        </div>
        <div className="bg-[#161c2c] border border-[#232b3e] rounded-xl p-4">
          <p className="text-sm text-slate-400">Valor Total Filtrado</p>
          <p className="text-2xl font-bold text-[#fcdc5d] mt-1">
            R$ {valorTotalFiltrado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-[#161c2c] border border-[#232b3e] rounded-xl p-4">
          <p className="text-sm text-slate-400">Em Revisão</p>
          <p className="text-2xl font-bold text-yellow-400 mt-1">
            {orcamentos.filter(o => o.status === 'revisao').length}
          </p>
        </div>
        <div className="bg-[#161c2c] border border-[#232b3e] rounded-xl p-4">
          <p className="text-sm text-slate-400">Aprovados Internamente</p>
          <p className="text-2xl font-bold text-green-400 mt-1">
            {orcamentos.filter(o => o.status === 'aprovado_interno').length}
          </p>
        </div>
      </div>

      {/* Lista de Orçamentos */}
      <div className="bg-[#161c2c] border border-[#232b3e] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#111622] border-b border-[#232b3e]">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Código
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Serviço
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Modo
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Valor
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Validade
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#232b3e]">
              {carregando ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center">
                    <div className="animate-pulse text-slate-400">Carregando...</div>
                  </td>
                </tr>
              ) : orcamentosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-400">
                    Nenhum orçamento encontrado
                  </td>
                </tr>
              ) : (
                orcamentosFiltrados.map((orcamento) => (
                  <tr
                    key={orcamento.id}
                    className="hover:bg-[#1a2234] transition-colors"
                  >
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="text-sm font-mono text-slate-300">
                        #{orcamento.codigo.toString().padStart(4, '0')}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm font-medium text-white">
                        {orcamento.cliente_nome}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-slate-300">
                        {orcamento.linha_servico}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={cn(
                          'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
                          statusConfig[orcamento.status].color
                        )}
                      >
                        {statusConfig[orcamento.status].icon}
                        {statusConfig[orcamento.status].label}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={cn(
                          'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium',
                          orcamento.modo === 'fechado'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        )}
                      >
                        {orcamento.modo === 'fechado' ? 'Fechado' : 'Aberto'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <span className="text-sm font-semibold text-white">
                        R$ {orcamento.valor_total.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <span className="text-sm text-slate-400">
                        {orcamento.validade_dias} dias
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/orcamentos/${orcamento.id}`}
                          className="p-2 hover:bg-[#232b3e] rounded-lg transition-colors"
                          title="Editar"
                        >
                          <FileText className="w-4 h-4 text-slate-400 hover:text-white" />
                        </Link>
                        <Link
                          href={`/admin/orcamentos/${orcamento.id}/proposta`}
                          className="p-2 hover:bg-[#232b3e] rounded-lg transition-colors"
                          title="Ver Proposta"
                        >
                          <CheckCircle className="w-4 h-4 text-slate-400 hover:text-[#fcdc5d]" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Rodapé com informações */}
      <div className="text-xs text-slate-500 text-center">
        <p>Orçamentos só podem ser enviados ao cliente com status &quot;Aprovado Interno&quot;</p>
        <p className="mt-1">Modo Fechado: valor único turnkey | Modo Aberto: composição detalhada (requer aprovação do sócio)</p>
      </div>
    </div>
  );
}
