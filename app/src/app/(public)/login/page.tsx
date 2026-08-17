'use client';

import { useState, Suspense, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

// ─── 3D Perspective Neon Grid Background ─────────────────────────────────────
function NeonPerspectiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    let offset = 0;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height * 0.45; // Vanishing point
      const bottomY = height;

      // Vertical perspective lines
      ctx.lineWidth = 1;
      const numLines = 36;
      for (let i = -numLines / 2; i <= numLines / 2; i++) {
        const spread = (i / (numLines / 2));
        const startX = cx + spread * (width * 0.9);
        
        const grad = ctx.createLinearGradient(cx, cy, startX, bottomY);
        grad.addColorStop(0, 'rgba(52, 211, 153, 0.0)');
        grad.addColorStop(0.3, 'rgba(52, 211, 153, 0.05)');
        grad.addColorStop(0.8, 'rgba(52, 211, 153, 0.18)');
        grad.addColorStop(1, 'rgba(52, 211, 153, 0.0)');

        ctx.strokeStyle = grad;
        ctx.beginPath();
        ctx.moveTo(cx + spread * 40, cy);
        ctx.lineTo(startX, bottomY);
        ctx.stroke();
      }

      // Horizontal moving grid lines
      offset = (offset + 0.35) % 40;
      for (let y = cy + 20; y < bottomY; y += 35) {
        const adjustedY = y + offset;
        if (adjustedY >= bottomY) continue;

        const progress = (adjustedY - cy) / (bottomY - cy);
        const halfW = (width * 0.85) * Math.pow(progress, 1.4);

        const hGrad = ctx.createLinearGradient(cx - halfW, adjustedY, cx + halfW, adjustedY);
        hGrad.addColorStop(0, 'rgba(52, 211, 153, 0)');
        hGrad.addColorStop(0.5, `rgba(52, 211, 153, ${0.18 * progress})`);
        hGrad.addColorStop(1, 'rgba(52, 211, 153, 0)');

        ctx.strokeStyle = hGrad;
        ctx.beginPath();
        ctx.moveTo(cx - halfW, adjustedY);
        ctx.lineTo(cx + halfW, adjustedY);
        ctx.stroke();
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
      {/* Dark vignette */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(10,10,10,0.4) 0%, rgba(10,10,10,0.95) 85%, #0a0a0a 100%)',
        }}
      />
      {/* Central Horizon Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] pointer-events-none blur-[120px] rounded-full"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(52,211,153,0.08) 0%, rgba(252,220,93,0.04) 45%, transparent 70%)',
        }}
      />
      <canvas ref={canvasRef} className="w-full h-full opacity-60" />
    </div>
  );
}

// ─── Login Form Component ──────────────────────────────────────────────────────
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/admin';

  const [mode, setMode] = useState<'login' | 'reset'>('login');
  const [email, setEmail] = useState('kiones91@gmail.com');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetSuccess, setResetSuccess] = useState<string | null>(null);

  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (err) {
        setError(err.message === 'Invalid login credentials' ? 'E-mail ou senha incorretos no Supabase.' : err.message);
        setLoading(false);
        return;
      }
      if (data.user) {
        router.push(redirectTo);
        router.refresh();
      }
    } catch {
      setError('Ocorreu um erro inesperado. Tente novamente.');
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResetSuccess(null);
    try {
      const { error: err } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/admin`,
      });
      if (err) {
        setError(err.message);
      } else {
        setResetSuccess(`Link de recuperação enviado com sucesso para ${email} via Supabase! Verifique sua caixa de entrada.`);
      }
    } catch {
      setError('Falha ao solicitar redefinição de senha no Supabase.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ── Outer circuit-style nodes — fixed to viewport, purely decorative ── */}
      <div className="pointer-events-none hidden md:block fixed inset-0 z-10">
        
        {/* Left upper node */}
        <div className="absolute left-4 top-1/4 flex items-center gap-2 text-neutral-700">
          <div className="h-px flex-1 bg-neutral-800 translate-x-2"></div>
          <div className="relative h-9 w-16 rounded-xl bg-neutral-900/80 shadow-[0_0_0_1px_rgba(82,82,91,0.4)] flex items-center justify-center">
            <div className="h-1 w-10 rounded-full bg-neutral-700"></div>
            {/* Pulsing chip dot */}
            <span className="absolute -left-1 h-1 w-1 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.65)] animate-pulse"></span>
          </div>
          {/* Line to card */}
          <div className="h-px w-12 bg-neutral-800"></div>
        </div>

        {/* Left bottom node */}
        <div className="absolute left-10 bottom-10 flex items-center gap-2 text-neutral-700">
          <div className="h-px flex-1 bg-neutral-800 translate-x-2"></div>
          <div className="relative h-9 w-20 rounded-xl bg-neutral-900/80 shadow-[0_0_0_1px_rgba(82,82,91,0.4)] flex items-center justify-center">
            <div className="flex gap-1">
              <span className="h-1 w-2 rounded bg-neutral-700"></span>
              <span className="h-1 w-2 rounded bg-neutral-700/60"></span>
              <span className="h-1 w-2 rounded bg-neutral-700/40"></span>
            </div>
            {/* Pulsing chip dot */}
            <span className="absolute -left-1 h-1 w-1 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.65)] animate-pulse"></span>
          </div>
          {/* Line to card */}
          <div className="h-px w-16 bg-neutral-800"></div>
        </div>

        {/* Right upper node */}
        <div className="absolute right-4 top-1/5 flex items-center gap-2 text-neutral-700">
          {/* Line to card */}
          <div className="h-px w-16 bg-neutral-800"></div>
          <div className="relative h-9 w-20 rounded-xl bg-neutral-900/80 shadow-[0_0_0_1px_rgba(82,82,91,0.4)] flex items-center justify-center">
            <div className="flex gap-1">
              <span className="h-1 w-6 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.65)]"></span>
            </div>
            {/* Pulsing chip dot */}
            <span className="absolute -right-1 h-1 w-1 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.65)] animate-pulse"></span>
          </div>
          <div className="h-px flex-1 bg-neutral-800 -translate-x-2"></div>
        </div>

        {/* Right bottom node */}
        <div className="absolute right-8 bottom-16 flex items-center gap-2 text-neutral-700">
          {/* Line to card */}
          <div className="h-px w-10 bg-neutral-800"></div>
          <div className="relative h-9 w-16 rounded-xl bg-neutral-900/80 shadow-[0_0_0_1px_rgba(82,82,91,0.4)] flex items-center justify-center">
            <div className="h-1 w-8 rounded-full bg-neutral-700"></div>
            {/* Pulsing chip dot */}
            <span className="absolute -right-1 h-1 w-1 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.65)] animate-pulse"></span>
          </div>
          <div className="h-px flex-1 bg-neutral-800 -translate-x-2"></div>
        </div>
      </div>

      {/* ── Main Glassmorphic Card (Fiel ao NeonGrid) ── */}
      <div
        className="w-full max-w-md bg-gradient-to-b from-neutral-900 via-neutral-900 to-neutral-800 border-neutral-800 border rounded-3xl relative shadow-2xl z-20"
        style={{ padding: '2.5rem' }}
      >
        
        {/* Top glow dots */}
        <div className="absolute left-10 top-5 hidden h-1.5 w-16 rounded-full bg-neutral-700/60 sm:block"></div>
        <div className="absolute right-10 top-5 hidden h-1.5 w-10 rounded-full bg-neutral-700/30 sm:block"></div>

        {/* Logo / Brand Icon */}
        <div className="flex justify-center">
          <div className="flex bg-neutral-900 w-14 h-14 rounded-2xl relative shadow-[0_0_0_1px_rgba(82,82,91,0.7)] items-center justify-center">
            <div className="flex bg-neutral-950 w-10 h-10 rounded-2xl relative items-center justify-center">
              {/* Duotone Sparkles / Lightning Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style={{ color: '#34d399' }} className="w-[24px] h-[24px]" aria-hidden="true" role="img" strokeWidth="2">
                <path fill="#34d399" d="M2.535 11.916c0 5.267 4.238 9.537 9.465 9.537s9.465-4.27 9.465-9.537a9.54 9.54 0 0 0-5.335-8.584a.776.776 0 0 1-.355-1.033a.765.765 0 0 1 1.026-.358A11.09 11.09 0 0 1 23 11.916C23 18.038 18.075 23 12 23S1 18.038 1 11.916C1 6.548 4.787 2.073 9.815 1.051c1.689-.343 2.952 1.104 2.952 2.617v2.134c1.894.364 3.326 2.05 3.326 4.076V14c0 2.291-1.832 4.148-4.093 4.148c-2.26 0-4.093-1.857-4.093-4.148V9.878c0-2.025 1.432-3.711 3.326-4.075V3.668c0-.766-.588-1.208-1.115-1.101c-4.326.879-7.583 4.732-7.583 9.35" opacity=".5"></path>
                <path fill="#34d399" d="M7.907 13.954c0 2.29 1.833 4.148 4.093 4.148s4.093-1.857 4.093-4.148v-3.37H7.907zm4.861-4.616h3.253c-.312-1.667-1.608-3.292-3.253-3.609zm-1.535 0V5.73c-1.645.317-2.942 1.942-3.254 3.61z"></path>
              </svg>
            </div>
          </div>
        </div>

        {/* Heading */}
        <div className="mt-6 text-center">
          <h1 className="text-[22px] leading-tight tracking-tight font-semibold text-neutral-50">
            {mode === 'login' ? 'Faça login no NeonGrid' : 'Recuperar Senha'}
          </h1>
          <p className="mt-2 text-sm font-normal text-neutral-400">
            {mode === 'login' ? (
              <>
                É novo na plataforma?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('reset'); setError(null); setResetSuccess(null); }}
                  className="font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  Crie uma conta
                </button>
              </>
            ) : (
              <>
                Informe seu e-mail do Supabase.{' '}
                <button
                  type="button"
                  onClick={() => { setMode('login'); setError(null); setResetSuccess(null); }}
                  className="font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  Voltar ao Login
                </button>
              </>
            )}
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mt-5 p-3 rounded-xl bg-red-950/40 border border-red-800/60 text-xs text-red-300 leading-relaxed animate-in fade-in">
            {error}
          </div>
        )}

        {resetSuccess && (
          <div className="mt-5 p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-xs text-emerald-300 leading-relaxed animate-in fade-in">
            {resetSuccess}
          </div>
        )}

        {/* ── Form Section ── */}
        {mode === 'login' ? (
          <form onSubmit={handleLogin} className="mt-8 space-y-5">
            {/* Work email */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-xs font-medium uppercase tracking-[0.16em] text-neutral-400">
                E-mail de trabalho
              </label>
              <div className="flex items-center rounded-xl border border-neutral-800 bg-neutral-950/60 px-3 py-2.5 text-sm text-neutral-100 shadow-inner shadow-black/40 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500/70 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="16" height="16" viewBox="0 0 24 24" className="h-4 w-4 text-neutral-500 shrink-0">
                  <path fill="currentColor" d="M22 5a3 3 0 1 1-6 0a3 3 0 0 1 6 0"></path>
                  <path fill="currentColor" d="M15.612 2.038C14.59 2 13.399 2 12 2C7.286 2 4.929 2 3.464 3.464C2 4.93 2 7.286 2 12s0 7.071 1.464 8.535C4.93 22 7.286 22 12 22s7.071 0 8.535-1.465C22 19.072 22 16.714 22 12c0-1.399 0-2.59-.038-3.612a4.5 4.5 0 0 1-6.35-6.35" opacity=".5"></path>
                  <path fill="currentColor" d="M3.465 20.536C4.929 22 7.286 22 12 22s7.072 0 8.536-1.465C21.893 19.179 21.993 17.056 22 13h-3.16c-.905 0-1.358 0-1.755.183c-.398.183-.693.527-1.282 1.214l-.605.706c-.59.687-.884 1.031-1.282 1.214s-.85.183-1.755.183h-.321c-.905 0-1.358 0-1.756-.183s-.692-.527-1.281-1.214l-.606-.706c-.589-.687-.883-1.031-1.281-1.214S6.066 13 5.16 13H2c.007 4.055.107 6.179 1.465 7.535"></path>
                </svg>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="você@studio.dev"
                  className="ml-3 flex-1 bg-transparent text-sm font-normal text-neutral-100 placeholder:text-neutral-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-xs font-medium uppercase tracking-[0.16em] text-neutral-400">
                  Senha
                </label>
                <button
                  type="button"
                  onClick={() => { setMode('reset'); setError(null); setResetSuccess(null); }}
                  className="text-xs font-medium text-neutral-400 hover:text-neutral-100 transition-colors"
                >
                  Esquecido?
                </button>
              </div>
              <div className="flex shadow-black/40 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500/70 text-sm text-neutral-100 bg-neutral-950/60 border-neutral-800 border rounded-xl pt-2.5 pr-3 pb-2.5 pl-3 shadow-inner items-center transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" style={{ color: 'rgb(115, 115, 115)' }} className="text-neutral-500 w-[16px] h-[16px] shrink-0" aria-hidden="true" role="img" strokeWidth="2">
                  <path fill="#737373" d="M2 16c0-2.828 0-4.243.879-5.121C3.757 10 5.172 10 8 10h8c2.828 0 4.243 0 5.121.879C22 11.757 22 13.172 22 16s0 4.243-.879 5.121C20.243 22 18.828 22 16 22H8c-2.828 0-4.243 0-5.121-.879C2 20.243 2 18.828 2 16" opacity=".5"></path>
                  <path fill="#737373" d="M6.75 8a5.25 5.25 0 0 1 10.5 0v2.004c.567.005 1.064.018 1.5.05V8a6.75 6.75 0 0 0-13.5 0v2.055a24 24 0 0 1 1.5-.051z"></path>
                </svg>
                <input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua senha"
                  className="ml-3 flex-1 bg-transparent text-sm font-normal text-neutral-100 placeholder:text-neutral-600 focus:outline-none font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="ml-2 rounded-full px-2 py-1 text-[11px] font-medium text-neutral-400 hover:bg-neutral-800/80 hover:text-neutral-100 transition"
                >
                  {showPass ? 'Ocultar' : 'Mostrar'}
                </button>
              </div>
            </div>

            {/* Primary button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-neutral-900 shadow-[0_14px_35px_rgba(16,185,129,0.55)] hover:bg-emerald-400 focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500/80 transition cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                  </svg>
                  Autenticando...
                </span>
              ) : (
                'Continuar para o painel de controle'
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 text-xs text-neutral-500">
              <div className="h-px flex-1 bg-neutral-800/80"></div>
              <span className="font-medium">OU</span>
              <div className="h-px flex-1 bg-neutral-800/80"></div>
            </div>

            {/* Social / Quick Access buttons */}
            <div className="grid grid-cols-3 gap-3">
              {/* WhatsApp Quick */}
              <a
                href="https://wa.me/5519983808498"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900 px-2 py-2.5 text-xs font-medium text-neutral-200 hover:border-neutral-700 hover:bg-neutral-800/80 transition group"
                title="WhatsApp Suporte"
              >
                <span className="sr-only">WhatsApp</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style={{ color: '#34d399' }} className="w-[24px] h-[24px] group-hover:scale-110 transition-transform">
                  <path fill="#34d399" d="M12 5a7 7 0 1 0 6.93 8H13a1 1 0 1 1 0-2h7a1 1 0 0 1 1 1a9 9 0 1 1-2.654-6.381a1 1 0 0 1-1.41 1.418A6.98 6.98 0 0 0 12 5"></path>
                </svg>
              </a>

              {/* Site Oficial */}
              <a
                href="https://tecmanutencao.vercel.app"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900 px-2 py-2.5 text-xs font-medium text-neutral-200 hover:border-neutral-700 hover:bg-neutral-800/80 transition group"
                title="Site Oficial"
              >
                <span className="sr-only">Site Oficial</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style={{ color: '#34d399' }} className="w-[24px] h-[24px] group-hover:scale-110 transition-transform">
                  <path fill="#34d399" d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 17.93c3.95-.49 7-3.85 7-7.93a7.9 7.9 0 0 0-.17-1.63L15 15.24zM4.07 13A8 8 0 0 1 11 4.07v1.07a2 2 0 0 0 2 2v2a2 2 0 0 0 2 2h2v2a1 1 0 0 0 1 1h1.9a8 8 0 0 1-15.83 0z"></path>
                </svg>
              </a>

              {/* Atendimento */}
              <Link
                href="/atendimento"
                className="flex items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900 px-2 py-2.5 text-xs font-medium text-neutral-200 hover:border-neutral-700 hover:bg-neutral-800/80 transition group"
                title="Central de Atendimento"
              >
                <span className="sr-only">Atendimento</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style={{ color: '#34d399' }} className="w-[24px] h-[24px] group-hover:scale-110 transition-transform">
                  <path fill="#34d399" d="M12 2a9 9 0 0 0-9 9v4a3 3 0 0 0 3 3h1v-6H5v-1a7 7 0 1 1 14 0v1h-2v6h1a3 3 0 0 0 3-3v-4a9 9 0 0 0-9-9z"></path>
                </svg>
              </Link>
            </div>

            {/* Subtext */}
            <p className="pt-1 text-[11px] leading-relaxed text-neutral-500">
              Ao continuar, você concorda com os{' '}
              <a href="#" className="font-medium text-neutral-200 hover:text-emerald-400 transition-colors">
                Termos
              </a>{' '}
              e a{' '}
              <a href="#" className="font-medium text-neutral-200 hover:text-emerald-400 transition-colors">
                Política de Privacidade
              </a>{' '}da NeonGrid.
            </p>
          </form>
        ) : (
          /* ── Reset Password Form (Supabase Auth) ── */
          <form onSubmit={handleResetPassword} className="mt-8 space-y-5">
            <div className="space-y-2">
              <label htmlFor="reset-email" className="block text-xs font-medium uppercase tracking-[0.16em] text-neutral-400">
                E-mail cadastrado
              </label>
              <div className="flex items-center rounded-xl border border-neutral-800 bg-neutral-950/60 px-3 py-2.5 text-sm text-neutral-100 shadow-inner shadow-black/40 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500/70 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="16" height="16" viewBox="0 0 24 24" className="h-4 w-4 text-neutral-500 shrink-0">
                  <path fill="currentColor" d="M22 5a3 3 0 1 1-6 0a3 3 0 0 1 6 0"></path>
                  <path fill="currentColor" d="M15.612 2.038C14.59 2 13.399 2 12 2C7.286 2 4.929 2 3.464 3.464C2 4.93 2 7.286 2 12s0 7.071 1.464 8.535C4.93 22 7.286 22 12 22s7.071 0 8.535-1.465C22 19.072 22 16.714 22 12c0-1.399 0-2.59-.038-3.612a4.5 4.5 0 0 1-6.35-6.35" opacity=".5"></path>
                  <path fill="currentColor" d="M3.465 20.536C4.929 22 7.286 22 12 22s7.072 0 8.536-1.465C21.893 19.179 21.993 17.056 22 13h-3.16c-.905 0-1.358 0-1.755.183c-.398.183-.693.527-1.282 1.214l-.605.706c-.59.687-.884 1.031-1.282 1.214s-.85.183-1.755.183h-.321c-.905 0-1.358 0-1.756-.183s-.692-.527-1.281-1.214l-.606-.706c-.589-.687-.883-1.031-1.281-1.214S6.066 13 5.16 13H2c.007 4.055.107 6.179 1.465 7.535"></path>
                </svg>
                <input
                  id="reset-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu.email@empresa.com"
                  className="ml-3 flex-1 bg-transparent text-sm font-normal text-neutral-100 placeholder:text-neutral-600 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-neutral-900 shadow-[0_14px_35px_rgba(16,185,129,0.55)] hover:bg-emerald-400 focus:outline-none transition cursor-pointer disabled:opacity-60"
            >
              {loading ? 'Enviando link...' : 'Enviar link via Supabase'}
            </button>

            <button
              type="button"
              onClick={() => { setMode('login'); setError(null); setResetSuccess(null); }}
              className="w-full text-center text-xs text-neutral-400 hover:text-neutral-200 transition-colors pt-2"
            >
              ← Voltar para o Login
            </button>
          </form>
        )}
      </div>
    </>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function LoginPage() {
  return (
    <main className="min-h-screen antialiased flex items-center justify-center text-neutral-100 bg-neutral-950 pr-4 pl-4 relative overflow-hidden">
      <NeonPerspectiveBackground />
      <Suspense
        fallback={
          <div className="fixed inset-0 flex items-center justify-center text-neutral-400">
            <span className="text-xs font-mono">Carregando...</span>
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </main>
  );
}
