/**
 * Motor de Precificação - TecManutenções ERP
 * 
 * REGRAS OBRIGATÓRIAS:
 * - Funções puras (zero imports de React/Supabase)
 * - Markup Divisor: Preço = CustoTotal / (1 − (Margem% + Imposto% + TaxasOperacionais%))
 * - NUNCA usar custo + % (proibido pela regra R4)
 */

import { z } from 'zod';

// ==================== SCHEMAS ====================

export const ParametrosFinanceirosSchema = z.object({
  margemPadrao: z.number().min(0).max(100),
  impostoAnexo3: z.number().min(0).max(100),
  impostoAnexo5: z.number().min(0).max(100),
  fatorR: z.boolean(),
  markupMaterialMin: z.number().min(0).max(100),
  markupMaterialMax: z.number().min(0).max(100),
  custoFixoMensalMin: z.number().positive(),
  custoFixoMensalMax: z.number().positive(),
  horasUteisMes: z.number().positive(),
  kmMin: z.number().positive(),
  kmMax: z.number().positive(),
  alimentacaoDia: z.number().positive(),
  saidaMinima: z.number().positive(),
  garantiaDias: z.number().int().positive(),
  artPadrao: z.number().positive(),
});

export type ParametrosFinanceiros = z.infer<typeof ParametrosFinanceirosSchema>;

export const ItemOrcamentoSchema = z.object({
  tipo: z.enum(['servico', 'material', 'logistica', 'adicional', 'terceiro', 'taxa', 'bdi']),
  descricao: z.string(),
  qtd: z.number().positive(),
  unidade: z.enum(['hora', 'dia', 'unidade', 'km']),
  custoUnit: z.number().nonnegative(),
  vendaUnit: z.number().nonnegative(),
  custoTotal: z.number().nonnegative(),
  vendaTotal: z.number().nonnegative(),
});

export type ItemOrcamento = z.infer<typeof ItemOrcamentoSchema>;

export const AdicionalSchema = z.object({
  codigo: z.string(),
  nome: z.string(),
  tipo: z.enum(['percentual', 'fixo_dia', 'fixo_projeto']),
  valor: z.number(),
  ambito: z.enum(['custo', 'venda', 'ambos']),
});

export type Adicional = z.infer<typeof AdicionalSchema>;

// ==================== ERROS CUSTOMIZADOS ====================

export class ErroPrecificacao extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ErroPrecificacao';
  }
}

export class ErroDivisorInvalido extends ErroPrecificacao {
  constructor(somaPercentuais: number) {
    super(`Divisor inválido: soma dos percentuais (${somaPercentuais.toFixed(2)}%) >= 100%. Ajuste margem, impostos ou taxas.`);
    this.name = 'ErroDivisorInvalido';
  }
}

export class ErroVendaMenorCusto extends ErroPrecificacao {
  constructor(item: string, custo: number, venda: number) {
    super(`Guarda financeira violada: "${item}" tem venda (R$ ${venda.toFixed(2)}) < custo (R$ ${custo.toFixed(2)}).`);
    this.name = 'ErroVendaMenorCusto';
  }
}

// ==================== FUNÇÕES PURAS DO MOTOR ====================

/**
 * Calcula o preço usando a fórmula de MARKUP DIVISOR (obrigatório)
 * 
 * Fórmula: Preço = CustoTotal / (1 − (Margem% + Imposto% + TaxasOperacionais%))
 * 
 * @param custoTotal - Soma de todos os custos diretos + BDI + adicionais de custo
 * @param margemPercentual - Margem de lucro desejada (0-100)
 * @param impostoPercentual - Imposto (6% Anexo III ou 15.5% Anexo V, pode cair para 6% com Fator R)
 * @param taxasOperacionaisPercentual - Taxas de cartão, plataforma, etc. (0-100)
 * @returns Preço de venda calculado
 * @throws ErroDivisorInvalido se soma dos percentuais >= 100
 */
export function calcularPrecoMarkupDivisor(
  custoTotal: number,
  margemPercentual: number,
  impostoPercentual: number,
  taxasOperacionaisPercentual: number = 0
): number {
  const somaPercentuais = margemPercentual + impostoPercentual + taxasOperacionaisPercentual;
  
  if (somaPercentuais >= 100) {
    throw new ErroDivisorInvalido(somaPercentuais);
  }
  
  const divisor = 1 - (somaPercentuais / 100);
  const precoVenda = custoTotal / divisor;
  
  return precoVenda;
}

/**
 * Calcula o BDI (Bonificação e Despesas Indiretas) por hora
 * 
 * Fórmula: BDI_hora = ponto_médio(custo_fixo) / horas_uteis_mes
 * 
 * @param custoFixoMin - Custo fixo mensal mínimo
 * @param custoFixoMax - Custo fixo mensal máximo
 * @param horasUteisMes - Horas úteis no mês (seed: 320h)
 * @returns BDI por hora
 */
export function calcularBDIporHora(
  custoFixoMin: number,
  custoFixoMax: number,
  horasUteisMes: number
): number {
  const custoFixoMedio = (custoFixoMin + custoFixoMax) / 2;
  return custoFixoMedio / horasUteisMes;
}

/**
 * Determina alíquota de imposto baseada no Anexo e Fator R
 * 
 * - Anexo III (manutenção/instalação): 6%
 * - Anexo V (engenharia/projetos): 15.5%, caindo para 6% se Fator R = true
 * 
 * @param anexo - 'III' ou 'V'
 * @param fatorR - True se folha >= 28% do faturamento
 * @param impostoAnexo3 - Alíquota Anexo III (padrão: 6)
 * @param impostoAnexo5 - Alíquota Anexo V (padrão: 15.5)
 * @returns Alíquota de imposto aplicável
 */
export function determinarAliquotaImposto(
  anexo: 'III' | 'V',
  fatorR: boolean,
  impostoAnexo3: number = 6,
  impostoAnexo5: number = 15.5
): number {
  if (anexo === 'III') {
    return impostoAnexo3;
  }
  
  // Anexo V: 15.5% normalmente, 6% se Fator R verdadeiro
  return fatorR ? impostoAnexo3 : impostoAnexo5;
}

/**
 * Calcula adicional industrial
 * 
 * @param baseValor - Valor base (custo ou venda conforme âmbito)
 * @param adicional - Configuração do adicional
 * @param diasOuPessoas - Quantidade de dias ou pessoas (para fixo_dia)
 * @returns Valor do adicional
 */
export function calcularAdicional(
  baseValor: number,
  adicional: Adicional,
  diasOuPessoas: number = 1
): number {
  switch (adicional.tipo) {
    case 'percentual':
      return baseValor * (adicional.valor / 100);
    case 'fixo_dia':
      return adicional.valor * diasOuPessoas;
    case 'fixo_projeto':
      return adicional.valor;
    default:
      return 0;
  }
}

/**
 * Valida guardas financeiras
 * 
 * - Alerta bloqueante quando venda < custo em qualquer taxa
 * - Divisor inválido (soma >= 100%) bloqueia cálculo
 * 
 * @param itens - Lista de itens do orçamento
 * @throws ErroVendaMenorCusto se algum item violar a guarda
 */
export function validarGuardasFinanceiras(itens: ItemOrcamento[]): void {
  for (const item of itens) {
    if (item.vendaUnit < item.custoUnit && item.vendaTotal < item.custoTotal) {
      throw new ErroVendaMenorCusto(item.descricao, item.custoUnit, item.vendaUnit);
    }
  }
}

/**
 * Calcula custo de logística
 * 
 * @param kmDistancia - Distância em km
 * @param diasViagem - Número de dias
 * @param pessoas - Número de pessoas
 * @param parametros - Parâmetros financeiros
 * @param pedagioCustoReal - Custo real de pedágio (opcional)
 * @param hotelCustoReal - Custo real de hotel (opcional)
 * @returns Objeto com detalhamento da logística
 */
export function calcularLogistica(
  kmDistancia: number,
  diasViagem: number,
  pessoas: number,
  parametros: ParametrosFinanceiros,
  pedagioCustoReal: number = 0,
  hotelCustoReal: number = 0
): {
  kmRodado: number;
  alimentacao: number;
  pedagio: number;
  hotel: number;
  total: number;
} {
  // Km rodado: usa ponto médio entre kmMin e kmMax
  const kmRate = (parametros.kmMin + parametros.kmMax) / 2;
  const kmRodado = kmDistancia * kmRate;
  
  // Alimentação: R$ 70/dia/pessoa
  const alimentacao = parametros.alimentacaoDia * diasViagem * pessoas;
  
  // Saída mínima predial (se aplicável)
  const saidaMinima = kmDistancia > 0 ? 0 : parametros.saidaMinima;
  
  const total = kmRodado + alimentacao + pedagioCustoReal + hotelCustoReal + saidaMinima;
  
  return {
    kmRodado,
    alimentacao,
    pedagio: pedagioCustoReal,
    hotel: hotelCustoReal,
    total,
  };
}

/**
 * Calcula markup de materiais
 * 
 * @param custoMaterial - Custo de aquisição do material
 * @param markupPercentual - Markup (20-30%, seed: 25%)
 * @returns Preço de venda do material
 */
export function calcularMarkupMaterial(
  custoMaterial: number,
  markupPercentual: number
): number {
  return custoMaterial * (1 + markupPercentual / 100);
}

/**
 * Calcula delta de lucro em hora terceirizada
 * 
 * @param vendaHora - Valor de venda por hora
 * @param custoHora - Custo real por hora
 * @param horas - Quantidade de horas
 * @returns Lucro total na terceirização
 */
export function calcularLucroTerceirizado(
  vendaHora: number,
  custoHora: number,
  horas: number
): number {
  const deltaHora = vendaHora - custoHora;
  return deltaHora * horas;
}

/**
 * Gera três cenários de preço para aprovação do sócio
 * 
 * @param custoTotal - Custo total do projeto
 * @param parametros - Parâmetros financeiros
 * @param anexo - Anexo tributário
 * @param faixaRefMin - Faixa de referência mínima (template)
 * @param faixaRefMax - Faixa de referência máxima (template)
 * @returns Três cenários: Divisor, Custo+Lucro-Alvo, Faixa Referência
 */
export function gerarTresCenarios(
  custoTotal: number,
  parametros: ParametrosFinanceiros,
  anexo: 'III' | 'V',
  faixaRefMin: number,
  faixaRefMax: number,
  margemAlvo?: number
): {
  cenarioA: { nome: string; preco: number; descricao: string };
  cenarioB: { nome: string; preco: number; descricao: string };
  cenarioC: { nome: string; preco: number; descricao: string };
} {
  const imposto = determinarAliquotaImposto(anexo, parametros.fatorR, parametros.impostoAnexo3, parametros.impostoAnexo5);
  
  // Cenário A: Divisor com margem padrão
  const precoA = calcularPrecoMarkupDivisor(
    custoTotal,
    parametros.margemPadrao,
    imposto,
    0
  );
  
  // Cenário B: Custo + Lucro-alvo (modo dossiês)
  const margemUsada = margemAlvo ?? parametros.margemPadrao;
  const precoB = custoTotal * (1 + margemUsada / 100);
  
  // Cenário C: Faixa de referência do template
  const precoC = (faixaRefMin + faixaRefMax) / 2;
  
  return {
    cenarioA: {
      nome: 'Divisor (Padrão)',
      preco: precoA,
      descricao: `Markup Divisor com margem de ${parametros.margemPadrao}%`,
    },
    cenarioB: {
      nome: 'Custo + Lucro-Alvo',
      preco: precoB,
      descricao: `Margem alvo de ${margemUsada}% sobre custo`,
    },
    cenarioC: {
      nome: 'Faixa de Referência',
      preco: precoC,
      descricao: `Média da faixa do template (R$ ${faixaRefMin.toLocaleString('pt-BR')}–${faixaRefMax.toLocaleString('pt-BR')})`,
    },
  };
}

/**
 * Calcula totais do orçamento
 * 
 * @param itens - Lista de itens
 * @param parametros - Parâmetros financeiros
 * @param anexo - Anexo tributário
 * @returns Totais detalhados
 */
export function calcularTotaisOrcamento(
  itens: ItemOrcamento[],
  parametros: ParametrosFinanceiros,
  anexo: 'III' | 'V' = 'III'
): {
  custoTotal: number;
  vendaTotal: number;
  impostoEstimado: number;
  lucroLiquido: number;
  margemEfetiva: number;
} {
  const custoTotal = itens.reduce((sum, item) => sum + item.custoTotal, 0);
  const vendaTotal = itens.reduce((sum, item) => sum + item.vendaTotal, 0);
  
  const imposto = determinarAliquotaImposto(anexo, parametros.fatorR, parametros.impostoAnexo3, parametros.impostoAnexo5);
  const impostoEstimado = vendaTotal * (imposto / 100);
  
  // Lucro líquido = Venda - Custo - Imposto
  const lucroLiquido = vendaTotal - custoTotal - impostoEstimado;
  
  // Margem efetiva = Lucro Líquido / Venda
  const margemEfetiva = vendaTotal > 0 ? (lucroLiquido / vendaTotal) * 100 : 0;
  
  return {
    custoTotal,
    vendaTotal,
    impostoEstimado,
    lucroLiquido,
    margemEfetiva,
  };
}

// ==================== SEEDS DE PARÂMETROS ====================

/**
 * Parâmetros financeiros seed (valores reais do negócio)
 */
export const PARAMETROS_SEED: ParametrosFinanceiros = {
  margemPadrao: 20,
  impostoAnexo3: 6,
  impostoAnexo5: 15.5,
  fatorR: true, // TODO-BUSINESS: Validar com contador
  markupMaterialMin: 20,
  markupMaterialMax: 30,
  custoFixoMensalMin: 9000,
  custoFixoMensalMax: 13000,
  horasUteisMes: 320, // TODO-BUSINESS: Validar com realidade da empresa
  kmMin: 1.8,
  kmMax: 2.5,
  alimentacaoDia: 70,
  saidaMinima: 50,
  garantiaDias: 90,
  artPadrao: 120,
};

// ==================== EXPORTS ====================

export default {
  calcularPrecoMarkupDivisor,
  calcularBDIporHora,
  determinarAliquotaImposto,
  calcularAdicional,
  validarGuardasFinanceiras,
  calcularLogistica,
  calcularMarkupMaterial,
  calcularLucroTerceirizado,
  gerarTresCenarios,
  calcularTotaisOrcamento,
  PARAMETROS_SEED,
};
