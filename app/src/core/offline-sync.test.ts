import { describe, it, expect } from 'vitest';
import {
  calcularAdicionais,
  gerarHashSHA256,
  gerarTextoTermoGarantia,
  deduplicarOutbox,
  type OutboxItem,
} from './offline-sync';

describe('Motor Offline & Adicionais de Campo (Seções 7.7 e 12)', () => {
  it('deve calcular corretamente adicional de periculosidade (+30%)', () => {
    const res = calcularAdicionais(100, 8, { periculosidade: true });
    expect(res.percentualTotal).toBe(30);
    expect(res.valorHorasComAdicional).toBe(1040); // 100 * 1.30 * 8 = 1040
    expect(res.valorTotalApontamento).toBe(1040);
  });

  it('deve calcular cumulativo de periculosidade (+30%) e noturno (+50%)', () => {
    const res = calcularAdicionais(100, 4, { periculosidade: true, noturno: true });
    expect(res.percentualTotal).toBe(80); // 30% + 50% = 80%
    expect(res.valorHorasComAdicional).toBe(720); // 100 * 1.80 * 4 = 720
    expect(res.valorTotalApontamento).toBe(720);
  });

  it('deve somar valores fixos diários (NR-33/35 R$ 80, Atmosfera Explosiva R$ 100)', () => {
    const res = calcularAdicionais(80, 8, {
      parada_fim_semana: true, // +50%
      nr33_nr35: true, // R$ 80
      atmosfera_explosiva: true, // R$ 100
    });
    // Horas: 80 * 1.5 * 8 = 960
    // Fixos: 80 + 100 = 180
    // Total: 960 + 180 = 1140
    expect(res.valorHorasComAdicional).toBe(960);
    expect(res.valorFixoDiario).toBe(180);
    expect(res.valorTotalApontamento).toBe(1140);
  });

  it('deve gerar texto consistente do Termo de Garantia 90 dias', () => {
    const termo = gerarTextoTermoGarantia(101, 'Cerâmica São Paulo', 'Adequação NR12 em Prensa Hidráulica');
    expect(termo).toContain('OS: #101');
    expect(termo).toContain('Cliente: Cerâmica São Paulo');
    expect(termo).toContain('Garantia Legal: 90 dias');
  });

  it('deve gerar hash SHA-256 do termo de garantia', async () => {
    const termo = gerarTextoTermoGarantia(101, 'Cerâmica São Paulo', 'Adequação NR12');
    const hash1 = await gerarHashSHA256(termo);
    const hash2 = await gerarHashSHA256(termo);
    expect(hash1).toBeDefined();
    expect(hash1.length).toBeGreaterThan(10);
    expect(hash1).toBe(hash2); // Idempotência do hash
  });

  it('deve deduplicar itens da outbox por sync_id (idempotência)', () => {
    const itens: OutboxItem[] = [
      {
        sync_id: 'uuid-1',
        tipo: 'apontamento',
        payload: { horas: 4 },
        status: 'pendente',
        tentativas: 1,
        criado_em: '2026-08-16T10:00:00Z',
        atualizado_em: '2026-08-16T10:00:00Z',
      },
      {
        sync_id: 'uuid-2',
        tipo: 'assinatura',
        payload: { nome: 'João' },
        status: 'pendente',
        tentativas: 1,
        criado_em: '2026-08-16T10:05:00Z',
        atualizado_em: '2026-08-16T10:05:00Z',
      },
      {
        sync_id: 'uuid-1', // Duplicado propositalmente
        tipo: 'apontamento',
        payload: { horas: 4 },
        status: 'sincronizando',
        tentativas: 2,
        criado_em: '2026-08-16T10:00:00Z',
        atualizado_em: '2026-08-16T10:06:00Z',
      },
    ];

    const deduplicados = deduplicarOutbox(itens);
    expect(deduplicados.length).toBe(2);
    expect(deduplicados.find((i) => i.sync_id === 'uuid-1')?.status).toBe('sincronizando');
  });
});
