/**
 * Cliente Supabase para TecManutenções ERP
 * 
 * Configuração SSR-safe para Next.js App Router
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Variáveis de ambiente do Supabase não configuradas');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

/**
 * Tipos auxiliares
 */
export type UserRole = 'admin' | 'tecnico' | 'financeiro' | 'sistema';

export interface Profile {
  id: string;
  role: UserRole;
  nome: string;
  email: string | null;
  criado_em: string;
}

export interface LeadStatus {
  status: 'novo' | 'confirmado' | 'qualificado' | 'duplicado' | 'invalido' | 'convertido' | 'descartado';
}

export interface OrcamentoStatus {
  status: 'rascunho' | 'revisao' | 'aprovado_interno' | 'enviado' | 'aceito' | 'recusado' | 'expirado' | 'convertido';
}

export interface OSStatus {
  status: 'criada' | 'agendada' | 'em_execucao' | 'aguardando_cliente' | 'concluida' | 'assinada' | 'faturada' | 'encerrada' | 'garantia' | 'cancelada';
}
