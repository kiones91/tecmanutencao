/**
 * financeiro.ts — Motor Financeiro, DRE por OS, Comparador de Cotações e Fila Fiscal
 * Conforme MASTER_ANTIGRAVITY.md Seções 7, 8 e 11
 */

export interface DRE_OS_Input {
  os_codigo: number | string;
  cliente_nome: string;
  valor_venda_total: number;
  aliquota_imposto_pct: number; // Ex: 6% (Anexo III) ou 15.5% (Anexo V)
  horas_proprias: {
    recurso_nome: string;
    horas: number;
    custo_hora: number;
    venda_hora: number;
  }[];
  horas_terceirizados: {
    terceiro_nome: string;
    horas: number;
    custo_hora_real: number; // Ex: R$ 35 - 50/h pago ao freela
    venda_hora_cobrada: number; // Ex: R$ 80 - 100/h cobrado do cliente
  }[];
  materiais: {
    descricao: string;
    custo_compra: number;
    valor_cobrado: number;
  }[];
  logistica: {
    km_rodados?: number;
    valor_km?: number; // Ex: R$ 1.80 a R$ 2.50
    alimentacao_dias?: number;
    valor_diaria_alimentacao?: number; // Ex: R$ 70/dia
    outros_gastos?: number;
  };
  custo_bdi_rateio: number; // Rateio fixo administrativo
}

export interface DRE_OS_Resultado {
  os_codigo: number | string;
  cliente_nome: string;
  receita_bruta: number;
  impostos_valor: number;
  receita_liquida: number;
  custo_mao_obra_propria: number;
  custo_terceirizados_total: number;
  venda_terceirizados_total: number;
  lucro_hora_terceirizada: number; // Delta entre venda e custo dos freelas
  custo_materiais_total: number;
  custo_logistica_total: number;
  custo_bdi_total: number;
  custo_total_os: number;
  lucro_bruto: number;
  lucro_liquido: number;
  margem_lucro_pct: number;
}

/**
 * Calcula o DRE completo e analítico de uma Ordem de Serviço
 */
export function calcularDRE_OS(input: DRE_OS_Input): DRE_OS_Resultado {
  const receita_bruta = input.valor_venda_total;
  const impostos_valor = Number(((receita_bruta * input.aliquota_imposto_pct) / 100).toFixed(2));
  const receita_liquida = receita_bruta - impostos_valor;

  // Custos Mão de Obra Própria
  const custo_mao_obra_propria = input.horas_proprias.reduce(
    (acc, cur) => acc + cur.horas * cur.custo_hora,
    0
  );

  // Custos e Vendas de Terceirizados
  let custo_terceirizados_total = 0;
  let venda_terceirizados_total = 0;

  for (const t of input.horas_terceirizados) {
    custo_terceirizados_total += t.horas * t.custo_hora_real;
    venda_terceirizados_total += t.horas * t.venda_hora_cobrada;
  }

  // Lucro gerado especificamente sobre as horas terceirizadas
  const lucro_hora_terceirizada = venda_terceirizados_total - custo_terceirizados_total;

  // Materiais
  const custo_materiais_total = input.materiais.reduce((acc, m) => acc + m.custo_compra, 0);

  // Logística
  const km_custo = (input.logistica.km_rodados || 0) * (input.logistica.valor_km || 2.0);
  const alimentacao_custo =
    (input.logistica.alimentacao_dias || 0) * (input.logistica.valor_diaria_alimentacao || 70);
  const outros_logistica = input.logistica.outros_gastos || 0;
  const custo_logistica_total = km_custo + alimentacao_custo + outros_logistica;

  const custo_bdi_total = input.custo_bdi_rateio || 0;

  const custo_total_os =
    custo_mao_obra_propria +
    custo_terceirizados_total +
    custo_materiais_total +
    custo_logistica_total +
    custo_bdi_total;

  const lucro_bruto = receita_liquida - (custo_mao_obra_propria + custo_terceirizados_total + custo_materiais_total + custo_logistica_total);
  const lucro_liquido = receita_liquida - custo_total_os;
  const margem_lucro_pct = receita_bruta > 0 ? Number(((lucro_liquido / receita_bruta) * 100).toFixed(2)) : 0;

  return {
    os_codigo: input.os_codigo,
    cliente_nome: input.cliente_nome,
    receita_bruta,
    impostos_valor,
    receita_liquida,
    custo_mao_obra_propria,
    custo_terceirizados_total,
    venda_terceirizados_total,
    lucro_hora_terceirizada,
    custo_materiais_total,
    custo_logistica_total,
    custo_bdi_total,
    custo_total_os,
    lucro_bruto,
    lucro_liquido,
    margem_lucro_pct,
  };
}

export interface CotacaoFornecedor {
  id: string;
  fornecedor_nome: string;
  descricao: string;
  valor_produtos: number;
  frete: number;
  prazo_dias: number;
  condicao_pagamento?: string;
}

/**
 * Avalia cotações de fornecedores e seleciona a melhor proposta
 * Ponderação: Custo Total (produtos + frete) com penalidade proporcional ao prazo de entrega
 */
export function avaliarCotacoes(cotacoes: CotacaoFornecedor[]) {
  if (!cotacoes || cotacoes.length === 0) return null;

  const cotacoesAvaliadas = cotacoes.map((c) => {
    const custoTotal = c.valor_produtos + c.frete;
    // Score de ponderação: Custo Total + R$ 35 por dia de prazo (impacto de espera da fábrica)
    const scorePonderado = custoTotal + c.prazo_dias * 35;
    return {
      ...c,
      custoTotal,
      scorePonderado,
      melhor: false,
    };
  });

  cotacoesAvaliadas.sort((a, b) => a.scorePonderado - b.scorePonderado);
  if (cotacoesAvaliadas.length > 0) {
    cotacoesAvaliadas[0].melhor = true;
  }

  return cotacoesAvaliadas;
}

export interface NFItem {
  id: string;
  os_id: string;
  numero?: string;
  valor: number;
  status: 'fila' | 'processando' | 'autorizada' | 'rejeitada' | 'cancelada';
  tentativas: number;
  erro?: string;
}

/**
 * Gerencia a máquina de estados e retries da fila fiscal (FocusNFe)
 */
export function processarFilaFiscal(
  item: NFItem,
  resultadoEmissao: { sucesso: boolean; numero?: string; erro?: string }
): NFItem {
  if (resultadoEmissao.sucesso) {
    return {
      ...item,
      status: 'autorizada',
      numero: resultadoEmissao.numero || item.numero,
      erro: undefined,
    };
  }

  const novasTentativas = item.tentativas + 1;
  if (novasTentativas >= 3) {
    return {
      ...item,
      status: 'rejeitada',
      tentativas: novasTentativas,
      erro: `Falha após 3 tentativas: ${resultadoEmissao.erro || 'Erro no webservice municipal/SEFAZ'}`,
    };
  }

  return {
    ...item,
    status: 'fila',
    tentativas: novasTentativas,
    erro: `Tentativa ${novasTentativas}/3 falhou: ${resultadoEmissao.erro || 'Instabilidade temporária'}`,
  };
}
