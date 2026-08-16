/**
 * bi-contratos.ts — Motor de Business Intelligence (BI) e Gestão de Contratos Recorrentes
 * Conforme MASTER_ANTIGRAVITY.md e docs/Clientes Prospeção/ativos.md
 */

export interface ContratoRecorrente {
  id: string;
  cliente_nome: string;
  tipo: 'predial' | 'industrial' | 'ambos';
  valor_mensal: number;
  dia_vencimento: number;
  sla_horas_atendimento: number; // Ex: 4h para emergências, 24h para preventivas
  status: 'ativo' | 'em_implantacao' | 'renovacao' | 'pausado';
  escopo_resumo: string;
  ultima_preventiva?: string;
  proxima_preventiva?: string;
}

export interface OportunidadeProspeccao {
  id: string;
  cliente_nome: string;
  contato_responsavel: string;
  tipo_servico: 'ponte_rolante' | 'obras_eletricas' | 'manutencao_industrial' | 'cftv_residencial' | 'instalacao_fabrica' | 'terceirizacao';
  valor_estimado: number;
  probabilidade_pct: number;
  estagio: 'contato_inicial' | 'visita_tecnica' | 'proposta_enviada' | 'negociacao';
  observacoes: string;
}

export const CONTRATOS_ATIVOS_INICIAIS: ContratoRecorrente[] = [
  {
    id: 'rec-1',
    cliente_nome: 'PEU',
    tipo: 'industrial',
    valor_mensal: 1200.0,
    dia_vencimento: 5,
    sla_horas_atendimento: 8,
    status: 'ativo',
    escopo_resumo: 'Manutenção elétrica industrial preventiva e corretiva',
    ultima_preventiva: '2026-08-01',
    proxima_preventiva: '2026-09-01',
  },
  {
    id: 'rec-2',
    cliente_nome: 'Dona Cida',
    tipo: 'predial',
    valor_mensal: 1200.0,
    dia_vencimento: 10,
    sla_horas_atendimento: 12,
    status: 'ativo',
    escopo_resumo: 'Manutenção predial e infraestrutura elétrica',
    ultima_preventiva: '2026-08-05',
    proxima_preventiva: '2026-09-05',
  },
  {
    id: 'rec-3',
    cliente_nome: 'Alemão',
    tipo: 'predial',
    valor_mensal: 300.0,
    dia_vencimento: 15,
    sla_horas_atendimento: 24,
    status: 'ativo',
    escopo_resumo: 'Suporte elétrico e vistorias periódicas',
    ultima_preventiva: '2026-08-10',
    proxima_preventiva: '2026-09-10',
  },
  {
    id: 'rec-4',
    cliente_nome: 'Igor + Grec',
    tipo: 'industrial',
    valor_mensal: 500.0,
    dia_vencimento: 20,
    sla_horas_atendimento: 12,
    status: 'ativo',
    escopo_resumo: 'Acompanhamento preventivo de quadros elétricos',
    ultima_preventiva: '2026-08-12',
    proxima_preventiva: '2026-09-12',
  },
];

export const PROSPECCOES_INICIAIS: OportunidadeProspeccao[] = [
  {
    id: 'prop-1',
    cliente_nome: 'Lucas RUMO',
    contato_responsavel: 'Lucas',
    tipo_servico: 'ponte_rolante',
    valor_estimado: 15000.0,
    probabilidade_pct: 70,
    estagio: 'negociacao',
    observacoes: 'Prospectar para pegar contrato de manutenção preventiva e corretiva de ponte rolante',
  },
  {
    id: 'prop-2',
    cliente_nome: 'Fernando Mutti / Caprem',
    contato_responsavel: 'Fernando Mutti',
    tipo_servico: 'obras_eletricas',
    valor_estimado: 45000.0,
    probabilidade_pct: 60,
    estagio: 'proposta_enviada',
    observacoes: 'Frente de trabalho e montagens nas obras da construtora CAPREM',
  },
  {
    id: 'prop-3',
    cliente_nome: 'Ricardo LWA',
    contato_responsavel: 'Ricardo',
    tipo_servico: 'manutencao_industrial',
    valor_estimado: 35000.0,
    probabilidade_pct: 80,
    estagio: 'visita_tecnica',
    observacoes: 'Contratos de trabalhos e paradas em indústrias',
  },
  {
    id: 'prop-4',
    cliente_nome: 'Ademir Ipeúna',
    contato_responsavel: 'Ademir',
    tipo_servico: 'instalacao_fabrica',
    valor_estimado: 75000.0,
    probabilidade_pct: 50,
    estagio: 'contato_inicial',
    observacoes: 'Remoção e Instalação completa de planta da Fábrica',
  },
  {
    id: 'prop-5',
    cliente_nome: 'Dono do Barracão da Moagem / Gildo',
    contato_responsavel: 'Gildo (Gerente RRC)',
    tipo_servico: 'manutencao_industrial',
    valor_estimado: 28000.0,
    probabilidade_pct: 75,
    estagio: 'visita_tecnica',
    observacoes: 'Contratos de Manutenção industrial e adequação geral de elétrica',
  },
];

/**
 * Calcula métricas de receita recorrente (MRR e ARR)
 */
export function calcularMetricasRecorrentes(contratos: ContratoRecorrente[]) {
  const contratosAtivos = contratos.filter((c) => c.status === 'ativo');
  const mrr = contratosAtivos.reduce((acc, c) => acc + c.valor_mensal, 0);
  const arr = mrr * 12;
  const ticketMedio = contratosAtivos.length > 0 ? mrr / contratosAtivos.length : 0;

  return {
    totalContratosAtivos: contratosAtivos.length,
    mrr,
    arr,
    ticketMedio: Number(ticketMedio.toFixed(2)),
  };
}

/**
 * Calcula o pipeline ponderado de vendas
 */
export function calcularPipelineVendas(oportunidades: OportunidadeProspeccao[]) {
  const totalPipelineBruto = oportunidades.reduce((acc, o) => acc + o.valor_estimado, 0);
  const totalPipelinePonderado = oportunidades.reduce(
    (acc, o) => acc + (o.valor_estimado * o.probabilidade_pct) / 100,
    0
  );

  return {
    totalOportunidades: oportunidades.length,
    totalPipelineBruto,
    totalPipelinePonderado: Number(totalPipelinePonderado.toFixed(2)),
  };
}

/**
 * Indicadores gerais de Business Intelligence
 */
export function calcularBIAnalytics(
  leadsCount: number,
  leadsQualificadosCount: number,
  orcamentosEnviadosCount: number,
  projetosFechadosCount: number,
  faturamentoTotal: number
) {
  const taxaQualificacao = leadsCount > 0 ? (leadsQualificadosCount / leadsCount) * 100 : 0;
  const taxaConversaoFinal = leadsCount > 0 ? (projetosFechadosCount / leadsCount) * 100 : 0;
  const ticketMedioProjetos = projetosFechadosCount > 0 ? faturamentoTotal / projetosFechadosCount : 0;

  return {
    taxaQualificacaoPct: Number(taxaQualificacao.toFixed(1)),
    taxaConversaoFinalPct: Number(taxaConversaoFinal.toFixed(1)),
    ticketMedioProjetos: Number(ticketMedioProjetos.toFixed(2)),
    distribuicaoLinhas: [
      { linha: 'Automação & Retrofit', sharePct: 45, cor: '#fcdc5d' },
      { linha: 'Paradas de Manutenção', sharePct: 30, cor: '#38bdf8' },
      { linha: 'Adequação NR12', sharePct: 20, cor: '#a855f7' },
      { linha: 'Contratos Recorrentes', sharePct: 5, cor: '#34d399' },
    ],
  };
}
