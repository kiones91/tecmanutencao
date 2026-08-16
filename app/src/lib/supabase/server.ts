/**
 * Cliente Supabase para Server Components (Next.js App Router)
 * 
 * Usa cookies para gerenciar sessão do lado do servidor
 */

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Em Server Components, não podemos definir cookies
            // O cliente do lado do cliente lidará com isso
          }
        },
      },
    }
  );
}

/**
 * Verifica se usuário está autenticado e retorna perfil
 */
export async function getCurrentUser() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return null;
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return { user, profile };
}

/**
 * Middleware helper para verificar autenticação
 */
export async function requireAuth() {
  const currentUser = await getCurrentUser();
  
  if (!currentUser?.user) {
    return { authenticated: false, redirect: true };
  }

  return { authenticated: true, ...currentUser, redirect: false };
}

/**
 * Verifica se usuário tem role admin
 */
export async function requireAdmin() {
  const currentUser = await getCurrentUser();
  
  if (!currentUser?.profile || currentUser.profile.role !== 'admin') {
    return { authorized: false, redirect: true };
  }

  return { authorized: true, ...currentUser, redirect: false };
}
