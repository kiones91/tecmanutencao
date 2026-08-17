'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Lock, Mail, ArrowRight, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/admin';

  const [email, setEmail] = useState('kiones91@gmail.com');
  const [password, setPassword] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [lembrarDeMim, setLembrarDeMim] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        setErrorMsg(
          error.message === 'Invalid login credentials'
            ? 'E-mail ou senha incorretos. Verifique suas credenciais.'
            : error.message
        );
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
    <div className="w-full max-w-[420px] bg-gradient-to-b from-[#161c28] to-[#0f141f] border border-[#232d42] rounded-3xl p-8 sm:p-10 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_40px_rgba(252,220,93,0.05)] text-[#f8fafc]">
      {/* Secure Area Tag */}
      <div className="flex items-center gap-2 mb-6">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]"></span>
        <span className="text-xs font-semibold text-emerald-400/90 tracking-wide">Área Segura</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold font-outfit text-white tracking-tight">Entrar</h1>
        <p className="text-xs sm:text-sm text-[#94a3b8] mt-1.5 leading-relaxed">
          Use seu e-mail e senha autorizados para acessar o painel operacional.
        </p>
      </div>

      {/* Error Alert */}
      {errorMsg && (
        <div className="mb-6 p-3.5 rounded-2xl bg-red-950/40 border border-red-800/60 flex items-start gap-2.5 text-red-300 text-xs animate-shake">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleLogin} className="space-y-5">
        {/* Email Field */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2">
            E-mail
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-[#64748b] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="voce@exemplo.com"
              className="w-full pl-11 pr-4 py-3.5 bg-[#0b0f17]/90 border border-[#232d42] rounded-2xl text-xs sm:text-sm text-white placeholder-[#64748b] focus:outline-none focus:border-[#fcdc5d] focus:ring-1 focus:ring-[#fcdc5d]/40 transition-all"
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-semibold text-slate-300">
              Senha
            </label>
            <a
              href="https://wa.me/5519983808498?text=Ol%C3%A1,%20esqueci%20minha%20senha%20do%20painel%20TecManuten%C3%A7%C3%B5es"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-[#94a3b8] hover:text-[#fcdc5d] transition-colors"
            >
              Esqueceu?
            </a>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-[#64748b] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type={mostrarSenha ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-11 pr-11 py-3.5 bg-[#0b0f17]/90 border border-[#232d42] rounded-2xl text-xs sm:text-sm text-white placeholder-[#64748b] focus:outline-none focus:border-[#fcdc5d] focus:ring-1 focus:ring-[#fcdc5d]/40 transition-all font-mono"
            />
            <button
              type="button"
              onClick={() => setMostrarSenha(!mostrarSenha)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#64748b] hover:text-white transition-colors"
            >
              {mostrarSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Remember me & Trouble */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 text-xs text-[#94a3b8] cursor-pointer select-none">
            <input
              type="checkbox"
              checked={lembrarDeMim}
              onChange={(e) => setLembrarDeMim(e.target.checked)}
              className="w-4 h-4 rounded-md bg-[#0b0f17] border-[#232d42] text-[#fcdc5d] focus:ring-0 focus:ring-offset-0 accent-[#fcdc5d]"
            />
            <span>Lembrar de mim</span>
          </label>
          <a
            href="https://wa.me/5519983808498?text=Preciso%20de%20ajuda%20para%20acessar%20o%20painel%20TecManuten%C3%A7%C3%B5es"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-[#94a3b8] hover:text-[#fcdc5d] transition-colors"
          >
            Problemas no acesso?
          </a>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-4 py-3.5 px-4 bg-[#fcdc5d] hover:bg-[#f5cb3c] text-[#0a0d14] font-extrabold text-sm rounded-2xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-[#fcdc5d]/20 active:scale-[0.98]"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Autenticando...</span>
            </>
          ) : (
            <>
              <span>Entrar no Sistema</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-[#232d42]/60 flex items-center justify-between text-[11px] text-[#64748b]">
        <span>TecManutenções ERP v3.0</span>
        <div className="flex items-center gap-3">
          <a href="https://tecmanutencao.vercel.app" target="_blank" className="hover:text-white transition-colors">
            Site Oficial
          </a>
          <span>·</span>
          <span className="text-emerald-400">Protegido por SSL</span>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-[#080b11] flex items-center justify-center p-4 sm:p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#182133] via-[#080b11] to-[#040609]">
      <Suspense
        fallback={
          <div className="flex items-center gap-2 text-[#94a3b8]">
            <Loader2 className="w-6 h-6 animate-spin text-[#fcdc5d]" />
            <span>Carregando login seguro...</span>
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </main>
  );
}
