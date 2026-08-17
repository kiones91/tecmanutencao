import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const DEFAULT_URL = 'https://kbcsuexsunxehcswxule.supabase.co';
const DEFAULT_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtiY3N1ZXhzdW54ZWhjc3d4dWxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY5MDMxNDEsImV4cCI6MjEwMjQ3OTE0MX0.KLS9zx0qisPQMWT8OrxhyqJSPWKOp6KbYk8gHIRixdM';

export async function createClient() {
  const cookieStore = await cookies();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_KEY;

  return createServerClient(
    url,
    key,
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
            // Chamado a partir de Server Component, pode ignorar
          }
        },
      },
    }
  );
}
