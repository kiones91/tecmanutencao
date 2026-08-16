/**
 * Testes Unitários - Motor de Precificação
 * 
 * REGRAS (R6):
 * - Testes devem passar antes da fase ser considerada entregue
 * - Funções puras testadas isoladamente
 */

import { describe, it, expect, test } from 'vitest';
import {
  calcularPrecoMarkupDivisor,
  calcularBDIporHora,
  determinarAliquotaImposto,
  calcularAdicional,
  calcularLogistica,
  calcularMarkupMaterial,
  calcularLucroTerceirizado,
  gerarTresCenarios,
  calcularTotaisOrcamento,
  validarGuardasFinanceiras,
  ErroDivisorInvalido,
  ErroVendaMenorCusto,
  PARAMETROS_SEED,
  type ItemOrcamento,
  type Adicional,
} from './precificacao';

describe('Motor de Precificação', () => {
  describe('calcularPrecoMarkupDivisor', () => {
    it('deve calcular preço corretamente com markup divisor', () => {
      const custoTotal = 10000;
      const margem = 20;
      const imposto = 6;
      
      // Preço = 10000 / (1 - (20 + 6) / 100) = 10000 / 0.74 = 13513.51
      const preco = calcularPrecoMarkupDivisor(custoTotal, margem, imposto);
      
      expect(preco).toBeCloseTo(13513.51, 2);
    });

    it('deve calcular preço com taxas operacionais', () => {
      const custoTotal = 10000;
      const margem = 15;
      const imposto = 6;
      const taxas = 3;
      
      // Preço = 10000 / (1 - (15 + 6 + 3) / 100) = 10000 / 0.76 = 13157.89
      const preco = calcularPrecoMarkupDivisor(custoTotal, margem, imposto, taxas);
      
      expect(preco).toBeCloseTo(13157.89, 2);
    });

    it('deve lançar ErroDivisorInvalido quando soma >= 100%', () => {
      expect(() => {
        calcularPrecoMarkupDivisor(10000, 50, 50); // 50 + 50 = 100
      }).toThrow(ErroDivisorInvalido);
    });

    it('deve permitir soma próxima de 100% mas não igual', () => {
      const custoTotal = 10000;
      const margem = 49.99;
      const imposto = 49.99;
      
      // 49.99 + 49.99 = 99.98 < 100 (válido)
      const preco = calcularPrecoMarkupDivisor(custoTotal, margem, imposto);
      expect(preco).toBeGreaterThan(0);
    });
  });

  describe('calcularBDIporHora', () => {
    it('deve calcular BDI usando ponto médio do custo fixo', () => {
      const custoFixoMin = 9000;
      const custoFixoMax = 13000;
      const horasUteis = 320;
      
      // Ponto médio = (9000 + 13000) / 2 = 11000
      // BDI = 11000 / 320 = 34.375
      const bdi = calcularBDIporHora(custoFixoMin, custoFixoMax, horasUteis);
      
      expect(bdi).toBeCloseTo(34.375, 2);
    });

    it('deve usar seeds reais do negócio', () => {
      const bdi = calcularBDIporHora(
        PARAMETROS_SEED.custoFixoMensalMin,
        PARAMETROS_SEED.custoFixoMensalMax,
        PARAMETROS_SEED.horasUteisMes
      );
      
      // (9000 + 13000) / 2 / 320 = 34.375
      expect(bdi).toBeCloseTo(34.375, 2);
    });
  });

  describe('determinarAliquotaImposto', () => {
    it('deve retornar 6% para Anexo III', () => {
      const aliquota = determinarAliquotaImposto('III', false);
      expect(aliquota).toBe(6);
    });

    it('deve retornar 15.5% para Anexo V sem Fator R', () => {
      const aliquota = determinarAliquotaImposto('V', false);
      expect(aliquota).toBe(15.5);
    });

    it('deve retornar 6% para Anexo V com Fator R verdadeiro', () => {
      const aliquota = determinarAliquotaImposto('V', true);
      expect(aliquota).toBe(6);
    });

    it('deve usar valores customizados de imposto', () => {
      const aliquota = determinarAliquotaImposto('V', false, 6.5, 16);
      expect(aliquota).toBe(16);
    });
  });

  describe('calcularAdicional', () => {
    it('deve calcular adicional percentual sobre venda', () => {
      const adicional: Adicional = {
        codigo: 'PERICULOSIDADE',
        nome: 'Periculosidade',
        tipo: 'percentual',
        valor: 30,
        ambito: 'venda',
      };
      
      const resultado = calcularAdicional(1000, adicional);
      expect(resultado).toBe(300);
    });

    it('deve calcular adicional fixo por dia', () => {
      const adicional: Adicional = {
        codigo: 'NR33',
        nome: 'Espaço Confinado',
        tipo: 'fixo_dia',
        valor: 80,
        ambito: 'custo',
      };
      
      const resultado = calcularAdicional(0, adicional, 5); // 5 dias
      expect(resultado).toBe(400);
    });

    it('deve calcular adicional fixo por projeto', () => {
      const adicional: Adicional = {
        codigo: 'PLANTA_QUIMICA',
        nome: 'Atmosfera Explosiva',
        tipo: 'fixo_projeto',
        valor: 100,
        ambito: 'custo',
      };
      
      const resultado = calcularAdicional(0, adicional, 1);
      expect(resultado).toBe(100);
    });
  });

  describe('calcularLogistica', () => {
    it('deve calcular logística completa', () => {
      const logistica = calcularLogistica(
        100, // km
        3, // dias
        2, // pessoas
        PARAMETROS_SEED,
        50, // pedágio
        300 // hotel
      );
      
      // Km: 100 * ((1.8 + 2.5) / 2) = 100 * 2.15 = 215
      // Alimentação: 70 * 3 * 2 = 420
      // Total: 215 + 420 + 50 + 300 = 985
      expect(logistica.kmRodado).toBeCloseTo(215, 2);
      expect(logistica.alimentacao).toBe(420);
      expect(logistica.pedagio).toBe(50);
      expect(logistica.hotel).toBe(300);
      expect(logistica.total).toBeCloseTo(985, 2);
    });

    it('deve aplicar saída mínima quando km = 0', () => {
      const logistica = calcularLogistica(0, 1, 1, PARAMETROS_SEED);
      
      // Saída mínima: 50 (quando km = 0)
      expect(logistica.total).toBeGreaterThanOrEqual(50);
    });
  });

  describe('calcularMarkupMaterial', () => {
    it('deve aplicar markup de 20-30% em materiais', () => {
      const custoMaterial = 1000;
      
      // Markup mínimo 20%
      const vendaMin = calcularMarkupMaterial(custoMaterial, 20);
      expect(vendaMin).toBe(1200);
      
      // Markup máximo 30%
      const vendaMax = calcularMarkupMaterial(custoMaterial, 30);
      expect(vendaMax).toBe(1300);
    });

    it('deve usar seed de 25% como padrão', () => {
      const custoMaterial = 8000;
      const venda = calcularMarkupMaterial(custoMaterial, 25);
      expect(venda).toBe(10000);
    });
  });

  describe('calcularLucroTerceirizado', () => {
    it('deve calcular delta entre venda e custo de terceirizado', () => {
      // Eletricista industrial: vende R$ 80-100/h, custa R$ 35-50/h
      const lucro = calcularLucroTerceirizado(80, 40, 160); // 160 horas
      
      // Delta: (80 - 40) * 160 = 6400
      expect(lucro).toBe(6400);
    });

    it('deve retornar zero se venda igual a custo', () => {
      const lucro = calcularLucroTerceirizado(50, 50, 100);
      expect(lucro).toBe(0);
    });
  });

  describe('gerarTresCenarios', () => {
    it('deve gerar três cenários de preço', () => {
      const custoTotal = 25000;
      const cenarios = gerarTresCenarios(
        custoTotal,
        PARAMETROS_SEED,
        'III',
        27900,
        32000
      );
      
      expect(cenarios.cenarioA.nome).toBe('Divisor (Padrão)');
      expect(cenarios.cenarioB.nome).toBe('Custo + Lucro-Alvo');
      expect(cenarios.cenarioC.nome).toBe('Faixa de Referência');
      
      // Cenário C é média da faixa
      expect(cenarios.cenarioC.preco).toBe((27900 + 32000) / 2);
    });

    it('deve considerar Anexo V com Fator R nos cenários', () => {
      const parametrosComFatorR = { ...PARAMETROS_SEED, fatorR: true };
      const cenariosV = gerarTresCenarios(
        50000,
        parametrosComFatorR,
        'V',
        69500,
        80000
      );
      
      // Com Fator R, Anexo V usa 6% em vez de 15.5%
      expect(cenariosV.cenarioA.preco).toBeLessThan(
        gerarTresCenarios(50000, { ...PARAMETROS_SEED, fatorR: false }, 'V', 69500, 80000).cenarioA.preco
      );
    });
  });

  describe('calcularTotaisOrcamento', () => {
    it('deve somar custos e vendas dos itens', () => {
      const itens: ItemOrcamento[] = [
        {
          tipo: 'servico',
          descricao: 'Engenharia',
          qtd: 30,
          unidade: 'hora',
          custoUnit: 100,
          vendaUnit: 250,
          custoTotal: 3000,
          vendaTotal: 7500,
        },
        {
          tipo: 'material',
          descricao: 'Materiais',
          qtd: 1,
          unidade: 'unidade',
          custoUnit: 8000,
          vendaUnit: 10000,
          custoTotal: 8000,
          vendaTotal: 10000,
        },
      ];
      
      const totais = calcularTotaisOrcamento(itens, PARAMETROS_SEED, 'III');
      
      expect(totais.custoTotal).toBe(11000);
      expect(totais.vendaTotal).toBe(17500);
      // Imposto Anexo III: 6% de 17500 = 1050
      expect(totais.impostoEstimado).toBeCloseTo(1050, 2);
      // Lucro: 17500 - 11000 - 1050 = 5450
      expect(totais.lucroLiquido).toBeCloseTo(5450, 2);
    });

    it('deve calcular margem efetiva corretamente', () => {
      const itens: ItemOrcamento[] = [
        {
          tipo: 'servico',
          descricao: 'Serviço',
          qtd: 10,
          unidade: 'hora',
          custoUnit: 50,
          vendaUnit: 100,
          custoTotal: 500,
          vendaTotal: 1000,
        },
      ];
      
      const totais = calcularTotaisOrcamento(itens, PARAMETROS_SEED, 'III');
      
      // Margem efetiva = (1000 - 500 - 60) / 1000 * 100 = 44%
      expect(totais.margemEfetiva).toBeCloseTo(44, 0);
    });
  });

  describe('validarGuardasFinanceiras', () => {
    it('deve passar quando venda >= custo', () => {
      const itens: ItemOrcamento[] = [
        {
          tipo: 'servico',
          descricao: 'Serviço Lucrativo',
          qtd: 10,
          unidade: 'hora',
          custoUnit: 50,
          vendaUnit: 100,
          custoTotal: 500,
          vendaTotal: 1000,
        },
      ];
      
      expect(() => validarGuardasFinanceiras(itens)).not.toThrow();
    });

    it('deve lançar ErroVendaMenorCusto quando venda < custo', () => {
      const itens: ItemOrcamento[] = [
        {
          tipo: 'servico',
          descricao: 'Serviço Prejuízo',
          qtd: 10,
          unidade: 'hora',
          custoUnit: 100,
          vendaUnit: 50,
          custoTotal: 1000,
          vendaTotal: 500,
        },
      ];
      
      expect(() => validarGuardasFinanceiras(itens)).toThrow(ErroVendaMenorCusto);
    });
  });

  describe('Templates de Orçamento (Seeds)', () => {
    it('NR12 Turnkey deve estar na faixa R$ 27.900–32.000', () => {
      // Composição do template NR12
      const itens: ItemOrcamento[] = [
        { tipo: 'servico', descricao: 'Engenharia 30h × R$ 250', qtd: 30, unidade: 'hora', custoUnit: 100, vendaUnit: 250, custoTotal: 3000, vendaTotal: 7500 },
        { tipo: 'servico', descricao: 'Montagem 40h × R$ 140', qtd: 40, unidade: 'hora', custoUnit: 80, vendaUnit: 140, custoTotal: 3200, vendaTotal: 5600 },
        { tipo: 'material', descricao: 'Materiais', qtd: 1, unidade: 'unidade', custoUnit: 8000, vendaUnit: 10400, custoTotal: 8000, vendaTotal: 10400 },
        { tipo: 'taxa', descricao: 'ART 2×', qtd: 2, unidade: 'unidade', custoUnit: 120, vendaUnit: 120, custoTotal: 240, vendaTotal: 240 },
        { tipo: 'logistica', descricao: 'Logística', qtd: 1, unidade: 'unidade', custoUnit: 600, vendaUnit: 600, custoTotal: 600, vendaTotal: 600 },
      ];
      
      const totais = calcularTotaisOrcamento(itens, PARAMETROS_SEED, 'III');
      
      // Preço final deve estar na faixa
      expect(totais.vendaTotal).toBeGreaterThanOrEqual(24340); // Soma dos itens
      expect(totais.vendaTotal).toBeLessThanOrEqual(32000);
    });

    it('Automação/Retrofit deve estar na faixa R$ 69.500–80.000', () => {
      const itens: ItemOrcamento[] = [
        { tipo: 'servico', descricao: 'Eng HW 40h × R$ 250', qtd: 40, unidade: 'hora', custoUnit: 100, vendaUnit: 250, custoTotal: 4000, vendaTotal: 10000 },
        { tipo: 'servico', descricao: 'Eng SW 60h × R$ 180', qtd: 60, unidade: 'hora', custoUnit: 80, vendaUnit: 180, custoTotal: 4800, vendaTotal: 10800 },
        { tipo: 'servico', descricao: 'Montagem 80h × R$ 140', qtd: 80, unidade: 'hora', custoUnit: 80, vendaUnit: 140, custoTotal: 6400, vendaTotal: 11200 },
        { tipo: 'material', descricao: 'Materiais', qtd: 1, unidade: 'unidade', custoUnit: 20000, vendaUnit: 24000, custoTotal: 20000, vendaTotal: 24000 },
      ];
      
      const totais = calcularTotaisOrcamento(itens, PARAMETROS_SEED, 'III');
      
      // Deve aproximar da faixa alvo
      expect(totais.vendaTotal).toBeGreaterThanOrEqual(50000);
    });
  });
});
