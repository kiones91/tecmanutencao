/**
 * offline-sync.ts — Motor de armazenamento local, idempotência e cálculo de adicionais para o PWA de campo.
 */

export interface ApontamentoPayload {
  sync_id: string;
  os_id: string;
  recurso_id?: string;
  recurso_nome: string;
  data: string;
  horas: number;
  adicionais: {
    periculosidade?: boolean; // +30%
    noturno?: boolean; // +50%
    parada_fim_semana?: boolean; // +50%
    nr33_nr35?: boolean; // R$ 80/dia
    atmosfera_explosiva?: boolean; // R$ 100/dia
    ruido_poeira?: boolean; // R$ 50/dia
  };
  geo?: {
    latitude: number;
    longitude: number;
    precisao?: number;
  };
  observacoes?: string;
  criado_em: string;
}

export interface AssinaturaPayload {
  sync_id: string;
  os_id: string;
  signatario_nome: string;
  signatario_doc: string;
  imagem_base64: string;
  hash_documento: string;
  termo_versao: number;
  geo?: {
    latitude: number;
    longitude: number;
  };
  user_agent?: string;
  assinado_em: string;
}

export interface OutboxItem {
  sync_id: string;
  tipo: 'apontamento' | 'assinatura' | 'checkin' | 'checkout' | 'status_os';
  payload: any;
  status: 'pendente' | 'sincronizando' | 'sincronizado' | 'erro';
  tentativas: number;
  erro_msg?: string;
  criado_em: string;
  atualizado_em: string;
}

/**
 * Calcula o acréscimo percentual e valores fixos de adicionais sobre um valor base de hora
 */
export function calcularAdicionais(
  valorHoraBase: number,
  horas: number,
  adicionais: ApontamentoPayload['adicionais']
) {
  let percentualAdicional = 0;
  let valorFixoDiario = 0;

  if (adicionais.periculosidade) percentualAdicional += 0.30;
  if (adicionais.noturno) percentualAdicional += 0.50;
  if (adicionais.parada_fim_semana) percentualAdicional += 0.50;

  if (adicionais.nr33_nr35) valorFixoDiario += 80;
  if (adicionais.atmosfera_explosiva) valorFixoDiario += 100;
  if (adicionais.ruido_poeira) valorFixoDiario += 50;

  const valorHorasComAdicional = valorHoraBase * (1 + percentualAdicional) * horas;
  const valorTotalApontamento = valorHorasComAdicional + valorFixoDiario;

  return {
    percentualTotal: percentualAdicional * 100,
    valorHorasComAdicional,
    valorFixoDiario,
    valorTotalApontamento,
  };
}

/**
 * Gera hash SHA-256 para auditoria de termos e assinaturas
 */
export async function gerarHashSHA256(conteudo: string): Promise<string> {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(conteudo);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  // Fallback simples caso crypto.subtle não esteja disponível no ambiente de teste
  let hash = 0;
  for (let i = 0; i < conteudo.length; i++) {
    const char = conteudo.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `sha256_mock_${Math.abs(hash).toString(16)}`;
}

/**
 * Cria o texto oficial do Termo de Garantia 90 Dias e Aceite de Vistoria
 */
export function gerarTextoTermoGarantia(osCodigo: number | string, clienteNome: string, servicoDescricao: string): string {
  return `TERMO DE CONCLUSAO E GARANTIA DE SERVICO - TECMANUTENCOES ERP
OS: #${osCodigo}
Cliente: ${clienteNome}
Descricao dos Servicos: ${servicoDescricao}
Garantia Legal: 90 dias a contar desta data contra defeitos de instalacao e montagem.
O cliente declara que os servicos foram executados conforme acordado e os equipamentos comissionados em perfeito funcionamento.
Versao do Termo: 1.0 (Auditoria e LGPD em conformidade com MASTER_ANTIGRAVITY.md)`;
}

/**
 * Deduplica lote de outbox para garantir idempotência por sync_id
 */
export function deduplicarOutbox(items: OutboxItem[]): OutboxItem[] {
  const mapa = new Map<string, OutboxItem>();
  for (const item of items) {
    mapa.set(item.sync_id, item);
  }
  return Array.from(mapa.values());
}
