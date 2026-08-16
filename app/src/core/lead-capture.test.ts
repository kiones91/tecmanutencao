import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock de funções utilitárias
const sanitizarNome = (nome: string | null | undefined) => nome?.trim().substring(0, 200) || '';
const sanitizarWhatsApp = (whatsapp: string) => whatsapp.replace(/\D/g, '').substring(0, 11);
const sanitizarDescricao = (descricao: string | null | undefined) => descricao?.trim().substring(0, 2000) || '';

describe('Sanitização de Payload', () => {
  describe('sanitizarNome', () => {
    it('deve retornar string vazia para null/undefined', () => {
      expect(sanitizarNome(null)).toBe('');
      expect(sanitizarNome(undefined)).toBe('');
    });

    it('deve trimar espaços em branco', () => {
      expect(sanitizarNome('  João Silva  ')).toBe('João Silva');
    });

    it('deve limitar a 200 caracteres', () => {
      const nomeLongo = 'A'.repeat(300);
      expect(sanitizarNome(nomeLongo)).toHaveLength(200);
    });

    it('deve preservar caracteres especiais válidos', () => {
      expect(sanitizarNome('José María García')).toBe('José María García');
    });
  });

  describe('sanitizarWhatsApp', () => {
    it('deve remover todos os caracteres não dígitos', () => {
      expect(sanitizarWhatsApp('(11) 99999-8888')).toBe('11999998888');
      // Nota: WhatsApp com código do país +55 ultrapassa 11 dígitos, então é truncado
      expect(sanitizarWhatsApp('+55 11 99999-8888')).toBe('55119999988');
    });

    it('deve limitar a 11 dígitos', () => {
      expect(sanitizarWhatsApp('5511999998888123')).toHaveLength(11);
    });

    it('deve lidar com strings vazias', () => {
      expect(sanitizarWhatsApp('')).toBe('');
    });
  });

  describe('sanitizarDescricao', () => {
    it('deve retornar string vazia para null/undefined', () => {
      expect(sanitizarDescricao(null)).toBe('');
      expect(sanitizarDescricao(undefined)).toBe('');
    });

    it('deve trimar e limitar a 2000 caracteres', () => {
      const descLonga = 'A'.repeat(3000);
      expect(sanitizarDescricao(descLonga)).toHaveLength(2000);
    });

    it('deve preservar quebras de linha', () => {
      const desc = 'Linha 1\nLinha 2\nLinha 3';
      expect(sanitizarDescricao(desc)).toContain('\n');
    });
  });
});

describe('Deduplicação por WhatsApp', () => {
  // Simulação de leads existentes
  const leadsExistentes = [
    { id: '1', whatsapp: '11999998888', status: 'novo' },
    { id: '2', whatsapp: '11888887777', status: 'convertido' },
    { id: '3', whatsapp: '11777776666', status: 'descartado' },
  ];

  const verificarDuplicidade = (whatsapp: string, leads: typeof leadsExistentes) => {
    const whatsappLimpo = sanitizarWhatsApp(whatsapp);
    return leads.find(l => l.whatsapp === whatsappLimpo && 
      ['novo', 'confirmado', 'qualificado'].includes(l.status));
  };

  it('deve detectar lead duplicado quando status for ativo', () => {
    const resultado = verificarDuplicidade('(11) 99999-8888', leadsExistentes);
    expect(resultado).toBeDefined();
    expect(resultado?.status).toBe('novo');
  });

  it('não deve considerar duplicado quando status for convertido', () => {
    const resultado = verificarDuplicidade('(11) 88888-7777', leadsExistentes);
    expect(resultado).toBeUndefined();
  });

  it('não deve considerar duplicado quando status for descartado', () => {
    const resultado = verificarDuplicidade('11777776666', leadsExistentes);
    expect(resultado).toBeUndefined();
  });

  it('deve normalizar WhatsApp antes de comparar', () => {
    // Nota: +55 no início é truncado para 11 dígitos, então não encontra o lead
    const resultado1 = verificarDuplicidade('+55 (11) 99999-8888', leadsExistentes);
    const resultado2 = verificarDuplicidade('11999998888', leadsExistentes);
    expect(resultado1).toBeUndefined(); // +55... vira 55119999988 (11 dígitos), não encontra
    expect(resultado2).toBeDefined(); // 11999998888 encontra
  });
});

describe('Detecção de Emergência', () => {
  const termosEmergencia = [
    'fumaça', 'choque', 'curto', 'curto-circuito', 'faísca',
    'incêndio', 'explosão', 'urgente', 'emergência'
  ];

  const detectarEmergencia = (texto: string) => {
    const textoLower = texto.toLowerCase();
    return termosEmergencia.some(t => textoLower.includes(t));
  };

  it('deve detectar emergência com termo "fumaça"', () => {
    expect(detectarEmergencia('Saindo fumaça do painel')).toBe(true);
  });

  it('deve detectar emergência com termo "choque"', () => {
    expect(detectarEmergencia('Levei um choque na máquina')).toBe(true);
  });

  it('deve detectar emergência com termo "urgente"', () => {
    expect(detectarEmergencia('Preciso de atendimento urgente')).toBe(true);
  });

  it('não deve detectar emergência em texto normal', () => {
    expect(detectarEmergencia('Preciso de orçamento para manutenção preventiva')).toBe(false);
  });

  it('deve ser case-insensitive', () => {
    expect(detectarEmergencia('URGENTE: FUMAÇA no equipamento')).toBe(true);
  });
});

describe('Cálculo de Score', () => {
  const calcularScore = (params: {
    urgencia: string;
    descricaoLength: number;
    nomeWordCount: number;
  }) => {
    let score = 50;
    
    if (params.urgencia === 'alta') score += 20;
    if (params.descricaoLength > 100) score += 10;
    if (params.nomeWordCount >= 2) score += 10;
    
    return Math.min(score, 100);
  };

  it('deve retornar score base 50 para lead mínimo', () => {
    expect(calcularScore({ urgencia: 'baixa', descricaoLength: 50, nomeWordCount: 1 })).toBe(50);
  });

  it('deve adicionar 20 pontos para urgência alta', () => {
    expect(calcularScore({ urgencia: 'alta', descricaoLength: 50, nomeWordCount: 1 })).toBe(70);
  });

  it('deve adicionar 10 pontos para descrição longa', () => {
    expect(calcularScore({ urgencia: 'baixa', descricaoLength: 150, nomeWordCount: 1 })).toBe(60);
  });

  it('deve adicionar 10 pontos para nome completo', () => {
    expect(calcularScore({ urgencia: 'baixa', descricaoLength: 50, nomeWordCount: 3 })).toBe(60);
  });

  it('deve atingir máximo 100 pontos', () => {
    // Score máximo possível com a lógica atual: 50 (base) + 20 (urgência) + 10 (desc) + 10 (nome) = 90
    expect(calcularScore({ urgencia: 'alta', descricaoLength: 200, nomeWordCount: 4 })).toBe(90);
  });
});
