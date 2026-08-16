/**
 * Templates de Orçamento - TecManutenções
 * 
 * Seeds baseados na SPEC do projeto (Seção 5)
 */

import { ItemOrcamento } from '../core/precificacao';

export interface TemplateOrcamento {
  id: string;
  nome: string;
  descricao: string;
  faixaRefMin: number;
  faixaRefMax: number;
  modoPadrao: 'fechado' | 'aberto';
  itens: ItemOrcamento[];
  premissas: string;
  exclusoes: string;
}

/**
 * Template NR12 TURNKEY (máquina média)
 * Faixa: R$ 27.900–32.000 | Modo padrão: FECHADO
 */
export const templateNR12: TemplateOrcamento = {
  id: 'nr12-turnkey',
  nome: 'NR12 Turnkey',
  descricao: 'Regularização NR12 completa com laudo (máquina média)',
  faixaRefMin: 27900,
  faixaRefMax: 32000,
  modoPadrao: 'fechado',
  itens: [
    {
      tipo: 'servico',
      descricao: 'Engenharia e Projeto NR12',
      qtd: 30,
      unidade: 'hora',
      custoUnit: 100,
      vendaUnit: 250,
      custoTotal: 3000,
      vendaTotal: 7500,
    },
    {
      tipo: 'servico',
      descricao: 'Montagem e Adequação',
      qtd: 40,
      unidade: 'hora',
      custoUnit: 100,
      vendaUnit: 140,
      custoTotal: 4000,
      vendaTotal: 5600,
    },
    {
      tipo: 'material',
      descricao: 'Materiais NR12 (guardas, proteções, sinalização)',
      qtd: 1,
      unidade: 'unidade',
      custoUnit: 8000,
      vendaUnit: 10400, // markup 30%
      custoTotal: 8000,
      vendaTotal: 10400,
    },
    {
      tipo: 'taxa',
      descricao: 'ART (2× R$ 120)',
      qtd: 2,
      unidade: 'unidade',
      custoUnit: 120,
      vendaUnit: 120,
      custoTotal: 240,
      vendaTotal: 240,
    },
    {
      tipo: 'logistica',
      descricao: 'Logística (transporte/alimentação)',
      qtd: 1,
      unidade: 'unidade',
      custoUnit: 600,
      vendaUnit: 600,
      custoTotal: 600,
      vendaTotal: 600,
    },
    {
      tipo: 'bdi',
      descricao: 'Custo Administrativo (BDI rateado)',
      qtd: 70, // horas totais do projeto
      unidade: 'hora',
      custoUnit: 34.375, // (9000+13000)/2 / 320h
      vendaUnit: 34.375,
      custoTotal: 2406.25,
      vendaTotal: 2406.25,
    },
  ],
  premissas: 'Orçamento baseado em máquina média industrial. Visita técnica para levantamento detalhado.',
  exclusoes: 'Não inclui reformas civis, adequações de rede elétrica geral ou substituição de máquina.',
};

/**
 * Template AUTOMAÇÃO / RETROFIT (máquina média)
 * Faixa: R$ 69.500–80.000 | Prazo: 20–45 dias
 */
export const templateAutomacao: TemplateOrcamento = {
  id: 'automacao-retrofit',
  nome: 'Automação / Retrofit',
  descricao: 'Retrofit completo de máquina com CLP + IHM + lógica',
  faixaRefMin: 69500,
  faixaRefMax: 80000,
  modoPadrao: 'fechado',
  itens: [
    {
      tipo: 'servico',
      descricao: 'Levantamento Lógico e Engenharia HW',
      qtd: 40,
      unidade: 'hora',
      custoUnit: 100,
      vendaUnit: 250,
      custoTotal: 4000,
      vendaTotal: 10000,
    },
    {
      tipo: 'servico',
      descricao: 'Engenharia de Software (programação CLP/IHM)',
      qtd: 60,
      unidade: 'hora',
      custoUnit: 100,
      vendaUnit: 180,
      custoTotal: 6000,
      vendaTotal: 10800,
    },
    {
      tipo: 'servico',
      descricao: 'Montagem Elétrica e Comissionamento',
      qtd: 80,
      unidade: 'hora',
      custoUnit: 100,
      vendaUnit: 140,
      custoTotal: 8000,
      vendaTotal: 11200,
    },
    {
      tipo: 'material',
      descricao: 'Materiais (CLP, IHM, sensores, cabos, painéis)',
      qtd: 1,
      unidade: 'unidade',
      custoUnit: 20000,
      vendaUnit: 24000, // markup 20%
      custoTotal: 20000,
      vendaTotal: 24000,
    },
    {
      tipo: 'logistica',
      descricao: 'Logística e Fixos',
      qtd: 1,
      unidade: 'unidade',
      custoUnit: 3500,
      vendaUnit: 3500,
      custoTotal: 3500,
      vendaTotal: 3500,
    },
    {
      tipo: 'bdi',
      descricao: 'Custo Administrativo (BDI rateado)',
      qtd: 180, // horas totais
      unidade: 'hora',
      custoUnit: 34.375,
      vendaUnit: 34.375,
      custoTotal: 6187.5,
      vendaTotal: 6187.5,
    },
  ],
  premissas: 'Retrofit custa ~80k vs máquina nova ~500k. Prazo: 20–45 dias úteis.',
  exclusoes: 'Não inclui máquinas novas, infraestrutura predial ou treinamento extensivo de operadores.',
};

/**
 * Template PARADA PROGRAMADA (5 dias, 7 pessoas)
 * Faixa: R$ 41.900 | Combo obrigatório: execução + laudo termográfico
 */
export const templateParada: TemplateOrcamento = {
  id: 'parada-programada',
  nome: 'Parada Programada',
  descricao: 'Manutenção programada de parada (5 dias, equipe 7 pessoas)',
  faixaRefMin: 38000,
  faixaRefMax: 45000,
  modoPadrao: 'fechado',
  itens: [
    {
      tipo: 'servico',
      descricao: 'Gestão Técnica (Engenheiro Responsável)',
      qtd: 40,
      unidade: 'hora',
      custoUnit: 100,
      vendaUnit: 200,
      custoTotal: 4000,
      vendaTotal: 8000,
    },
    {
      tipo: 'servico',
      descricao: 'Liderança de Equipe (Sócios)',
      qtd: 80,
      unidade: 'hora',
      custoUnit: 80,
      vendaUnit: 120,
      custoTotal: 6400,
      vendaTotal: 9600,
    },
    {
      tipo: 'terceiro',
      descricao: 'Eletricistas Freelancers (4 pessoas)',
      qtd: 160, // 4 pessoas × 40h/semana × 5 dias ≈ 160h
      unidade: 'hora',
      custoUnit: 45, // custo real médio
      vendaUnit: 80,
      custoTotal: 7200,
      vendaTotal: 12800,
    },
    {
      tipo: 'material',
      descricao: 'Insumos e EPIs',
      qtd: 1,
      unidade: 'unidade',
      custoUnit: 2000,
      vendaUnit: 2600, // markup 30%
      custoTotal: 2000,
      vendaTotal: 2600,
    },
    {
      tipo: 'logistica',
      descricao: 'Alimentação e Transporte da Equipe',
      qtd: 1,
      unidade: 'unidade',
      custoUnit: 1500,
      vendaUnit: 1500,
      custoTotal: 1500,
      vendaTotal: 1500,
    },
    {
      tipo: 'adicional',
      descricao: 'Laudo Termográfico (combo obrigatório)',
      qtd: 1,
      unidade: 'unidade',
      custoUnit: 800,
      vendaUnit: 1200,
      custoTotal: 800,
      vendaTotal: 1200,
    },
    {
      tipo: 'bdi',
      descricao: 'Custo Administrativo (BDI rateado)',
      qtd: 280, // horas totais
      unidade: 'hora',
      custoUnit: 34.375,
      vendaUnit: 34.375,
      custoTotal: 9625,
      vendaTotal: 9625,
    },
  ],
  premissas: 'Parada de 5 dias com equipe de 7 pessoas. Combo: execução + laudo termográfico incluso.',
  exclusoes: 'Não inclui peças de reposição não previstas ou paralisações por falta de energia da fábrica.',
};

/**
 * Template PREDIAL/INDUSTRIAL BASE
 * Faixa: R$ 5.000–15.000 | Manutenção corretiva/preventiva geral
 */
export const templatePredial: TemplateOrcamento = {
  id: 'predial-industrial-base',
  nome: 'Predial / Industrial Base',
  descricao: 'Manutenção predial ou industrial (corretiva/preventiva)',
  faixaRefMin: 5000,
  faixaRefMax: 15000,
  modoPadrao: 'fechado',
  itens: [
    {
      tipo: 'servico',
      descricao: 'Diagnóstico Técnico',
      qtd: 4,
      unidade: 'hora',
      custoUnit: 80,
      vendaUnit: 150,
      custoTotal: 320,
      vendaTotal: 600,
    },
    {
      tipo: 'servico',
      descricao: 'Execução de Manutenção',
      qtd: 16,
      unidade: 'hora',
      custoUnit: 60,
      vendaUnit: 120,
      custoTotal: 960,
      vendaTotal: 1920,
    },
    {
      tipo: 'material',
      descricao: 'Materiais e Peças (estimativa)',
      qtd: 1,
      unidade: 'unidade',
      custoUnit: 2000,
      vendaUnit: 2600, // markup 30%
      custoTotal: 2000,
      vendaTotal: 2600,
    },
    {
      tipo: 'logistica',
      descricao: 'Saída Técnica (km + alimentação)',
      qtd: 1,
      unidade: 'unidade',
      custoUnit: 300,
      vendaUnit: 300,
      custoTotal: 300,
      vendaTotal: 300,
    },
    {
      tipo: 'bdi',
      descricao: 'Custo Administrativo (BDI rateado)',
      qtd: 20, // horas totais
      unidade: 'hora',
      custoUnit: 34.375,
      vendaUnit: 34.375,
      custoTotal: 687.5,
      vendaTotal: 687.5,
    },
  ],
  premissas: 'Orçamento base para manutenção predial ou industrial. Valores podem variar conforme complexidade.',
  exclusoes: 'Não inclui serviços em altura (NR-35), espaço confinado (NR-33) ou áreas classificadas sem adicional.',
};

export const TEMPLATES_ORCAMENTO: TemplateOrcamento[] = [
  templateNR12,
  templateAutomacao,
  templateParada,
  templatePredial,
];

export function getTemplateById(id: string): TemplateOrcamento | undefined {
  return TEMPLATES_ORCAMENTO.find(t => t.id === id);
}

export function getTemplatesByTipo(tipo: 'nr12' | 'automacao' | 'parada' | 'predial'): TemplateOrcamento[] {
  switch (tipo) {
    case 'nr12':
      return [templateNR12];
    case 'automacao':
      return [templateAutomacao];
    case 'parada':
      return [templateParada];
    case 'predial':
      return [templatePredial];
    default:
      return TEMPLATES_ORCAMENTO;
  }
}
