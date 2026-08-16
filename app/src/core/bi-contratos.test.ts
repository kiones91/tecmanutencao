import { describe, it, expect } from 'vitest';
import {
  calcularMetricasRecorrentes,
  calcularPipelineVendas,
  calcularBIAnalytics,
  CONTRATOS_ATIVOS_INICIAIS,
  PROSPECCOES_INICIAIS,
} from './bi-contratos';

describe('Motor de BI & Contratos Recorrentes (Seções 8 e 11)', () => {
  it('deve calcular corretamente o MRR e ARR dos contratos mapeados em ativos.md', () => {
    // PEU (1200) + Dona Cida (1200) + Alemão (300) + Igor + Grec (500) = R$ 3.200,00/mês
    const res = calcularMetricasRecorrentes(CONTRATOS_ATIVOS_INICIAIS);
    expect(res.totalContratosAtivos).toBe(4);
    expect(res.mrr).toBe(3200);
    expect(res.arr).toBe(38400); // 3200 * 12 = 38400
    expect(res.ticketMedio).toBe(800); // 3200 / 4 = 800
  });

  it('deve calcular o pipeline de prospecções ponderado pela probabilidade de fechamento', () => {
    const res = calcularPipelineVendas(PROSPECCOES_INICIAIS);
    expect(res.totalOportunidades).toBe(5);
    expect(res.totalPipelineBruto).toBeGreaterThan(150000);
    expect(res.totalPipelinePonderado).toBeGreaterThan(100000);
  });

  it('deve calcular taxas de conversão e ticket médio de projetos de engenharia', () => {
    const bi = calcularBIAnalytics(20, 14, 10, 6, 240000);
    expect(bi.taxaQualificacaoPct).toBe(70); // 14 / 20 = 70%
    expect(bi.taxaConversaoFinalPct).toBe(30); // 6 / 20 = 30%
    expect(bi.ticketMedioProjetos).toBe(40000); // 240000 / 6 = 40000
    expect(bi.distribuicaoLinhas.length).toBe(4);
  });
});
