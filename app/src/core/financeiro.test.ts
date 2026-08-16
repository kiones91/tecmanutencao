import { describe, it, expect } from 'vitest';
import {
  calcularDRE_OS,
  avaliarCotacoes,
  processarFilaFiscal,
  type DRE_OS_Input,
  type CotacaoFornecedor,
  type NFItem,
} from './financeiro';

describe('Motor Financeiro & DRE por OS (Seções 7.6, 8.2 e 11)', () => {
  it('deve calcular o DRE com precisão e demonstrar o lucro de horas terceirizadas', () => {
    // Cenário: Parada Programada (5 dias, liderança + freelas)
    const input: DRE_OS_Input = {
      os_codigo: 101,
      cliente_nome: 'Cerâmica São Paulo',
      valor_venda_total: 41900,
      aliquota_imposto_pct: 6, // Anexo III (6%)
      horas_proprias: [
        { recurso_nome: 'Maike (Gestão)', horas: 40, custo_hora: 100, venda_hora: 200 }, // Custo 4000, Venda 8000
        { recurso_nome: 'Kiones (Liderança)', horas: 80, custo_hora: 60, venda_hora: 120 }, // Custo 4800, Venda 9600
      ],
      horas_terceirizados: [
        // 4 freelas eletricistas: 160h total. Custo R$ 40/h, Venda cobrada R$ 80/h
        { terceiro_nome: '4 Eletricistas Freela', horas: 160, custo_hora_real: 40, venda_hora_cobrada: 80 },
      ],
      materiais: [
        { descricao: 'EPIs e Insumos de Conexão', custo_compra: 2000, valor_cobrado: 2600 },
      ],
      logistica: {
        km_rodados: 300,
        valor_km: 2.0, // 600
        alimentacao_dias: 15,
        valor_diaria_alimentacao: 70, // 1050
      },
      custo_bdi_rateio: 1500,
    };

    const dre = calcularDRE_OS(input);

    expect(dre.receita_bruta).toBe(41900);
    expect(dre.impostos_valor).toBe(2514); // 41900 * 0.06 = 2514
    expect(dre.receita_liquida).toBe(39386);

    // Mão de obra própria
    expect(dre.custo_mao_obra_propria).toBe(8800); // 4000 + 4800

    // Terceirizados: 160h * 40 = 6400 de custo. Venda cobrada: 160 * 80 = 12800. Lucro = 6400!
    expect(dre.custo_terceirizados_total).toBe(6400);
    expect(dre.venda_terceirizados_total).toBe(12800);
    expect(dre.lucro_hora_terceirizada).toBe(6400);

    // Logística: 600 (km) + 1050 (alim) = 1650
    expect(dre.custo_logistica_total).toBe(1650);

    // Lucro Líquido deve ser positivo e margem calculada
    expect(dre.lucro_liquido).toBeGreaterThan(15000);
    expect(dre.margem_lucro_pct).toBeGreaterThan(35);
  });

  it('deve escolher a melhor cotação ponderando custo total e prazo', () => {
    const cotacoes: CotacaoFornecedor[] = [
      {
        id: 'c1',
        fornecedor_nome: 'Distribuidora A',
        descricao: 'Cabos 50mm e Disjuntores Caixa Moldada',
        valor_produtos: 8500,
        frete: 300, // Total 8800
        prazo_dias: 10, // Score: 8800 + 350 = 9150
      },
      {
        id: 'c2',
        fornecedor_nome: 'Distribuidora B (Pronta Entrega)',
        descricao: 'Cabos 50mm e Disjuntores Caixa Moldada',
        valor_produtos: 8600,
        frete: 150, // Total 8750
        prazo_dias: 2, // Score: 8750 + 70 = 8820 -> VENCEDORA!
      },
      {
        id: 'c3',
        fornecedor_nome: 'Distribuidora C',
        descricao: 'Cabos 50mm e Disjuntores Caixa Moldada',
        valor_produtos: 8900,
        frete: 200, // Total 9100
        prazo_dias: 5,
      },
    ];

    const resultado = avaliarCotacoes(cotacoes);
    expect(resultado).toBeDefined();
    expect(resultado![0].id).toBe('c2');
    expect(resultado![0].melhor).toBe(true);
    expect(resultado![1].melhor).toBe(false);
  });

  it('deve gerenciar retries e contingência na fila fiscal', () => {
    let nf: NFItem = {
      id: 'nf-1',
      os_id: 'os-101',
      valor: 41900,
      status: 'fila',
      tentativas: 0,
    };

    // Tentativa 1: falha temporária
    nf = processarFilaFiscal(nf, { sucesso: false, erro: 'Timeout SEFAZ' });
    expect(nf.status).toBe('fila');
    expect(nf.tentativas).toBe(1);

    // Tentativa 2: falha temporária
    nf = processarFilaFiscal(nf, { sucesso: false, erro: 'Instabilidade Webservice' });
    expect(nf.status).toBe('fila');
    expect(nf.tentativas).toBe(2);

    // Tentativa 3: atinge limite -> entra em contingência / rejeitada
    nf = processarFilaFiscal(nf, { sucesso: false, erro: 'Erro de validação cadastral' });
    expect(nf.status).toBe('rejeitada');
    expect(nf.tentativas).toBe(3);
    expect(nf.erro).toContain('Falha após 3 tentativas');

    // Se tiver sucesso em outra NF
    const nfSucesso = processarFilaFiscal(
      { id: 'nf-2', os_id: 'os-102', valor: 12000, status: 'fila', tentativas: 1 },
      { sucesso: true, numero: '2026-0089' }
    );
    expect(nfSucesso.status).toBe('autorizada');
    expect(nfSucesso.numero).toBe('2026-0089');
  });
});
