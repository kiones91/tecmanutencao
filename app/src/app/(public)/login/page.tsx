'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Wrench, Lock, Mail, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message === 'Invalid login credentials' 
          ? 'E-mail ou senha incorretos. Verifique suas credenciais.'
          : error.message);
        setLoading(false);
        return;
      }

      if (data.user) {
        router.push(redirectTo);
        router.refresh();
      }
    } catch (err: unknown) {
      setErrorMsg('Ocorreu um erro inesperado ao autenticar. Tente novamente.');
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-[#161c2c] border border-[#232b3e] rounded-2xl p-8 shadow-2xl">
      {/* Header */}
      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-[#fcdc5d]/10 border border-[#fcdc5d]/30 flex items-center justify-center mb-4">
          <Wrench className="w-7 h-7 text-[#fcdc5d]" />
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">TecManutenções ERP</h1>
        <p className="text-sm text-[#94a3b8] mt-1">Acesso Restrito ao Painel Operacional</p>
      </div>

      {/* Error Alert */}
      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-800/60 flex items-start gap-3 text-red-300 text-sm">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#94a3b8] mb-2">
            E-mail Corporativo
          </label>
          <div className="relative">
            <Mail className="w-5 h-5 text-[#94a3b8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@tecmanutencao.com.br"
              className="w-full pl-11 pr-4 py-3 bg-[#111622] border border-[#232b3e] rounded-xl text-white placeholder-[#94a3b8]/40 focus:outline-none focus:border-[#fcdc5d] transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#94a3b8] mb-2">
            Senha de Acesso
          </label>
          <div className="relative">
            <Lock className="w-5 h-5 text-[#94a3b8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-11 pr-4 py-3 bg-[#111622] border border-[#232b3e] rounded-xl text-white placeholder-[#94a3b8]/40 focus:outline-none focus:border-[#fcdc5d] transition-colors"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 py-3.5 px-4 bg-[#fcdc5d] hover:bg-[#f5cb3c] text-[#0a0d14] font-bold rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#fcdc5d]/10"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Autenticando...</span>
            </>
          ) : (
            <>
              <span>Entrar no Sistema</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </form>

      {/* Footer info */}
      <div className="mt-8 pt-6 border-t border-[#232b3e] flex items-center justify-between text-xs text-[#94a3b8]">
        <Link href="/" className="hover:text-white transition-colors">
          &larr; Voltar ao Início
        </Link>
        <span>MDK / TecManutenção v3.0</span>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#0a0d14] flex items-center justify-center p-4">
      <Suspense fallback={
        <div className="flex items-center gap-2 text-[#94a3b8]">
          <Loader2 className="w-6 h-6 animate-spin text-[#fcdc5d]" />
          <span>Carregando login...</span>
        </div>
      }>
        <LoginForm />
      </Suspense>
    </main>
  );
}
