'use client';

import { useState, Suspense, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

// ─── NeonGrid Background Canvas ───────────────────────────────────────────────
function NeonGridBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId: number;
    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);

    const onResize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    const CELL = 44;
    type Beam = { x: number; y: number; len: number; spd: number; op: number; vert: boolean; rgb: string };

    const beams: Beam[] = Array.from({ length: 14 }, () => ({
      x: Math.floor((Math.random() * window.innerWidth) / CELL) * CELL,
      y: Math.floor((Math.random() * window.innerHeight) / CELL) * CELL,
      len: Math.random() * 120 + 80,
      spd: Math.random() * 0.6 + 0.25,
      op: Math.random() * 0.35 + 0.15,
      vert: Math.random() > 0.4,
      rgb: Math.random() > 0.45 ? '252,220,93' : '52,211,153',
    }));

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      // grid
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(35,45,66,0.22)';
      for (let x = 0; x <= W; x += CELL) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      for (let y = 0; y <= H; y += CELL) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
      // beams
      beams.forEach((b) => {
        ctx.save();
        const g = b.vert
          ? ctx.createLinearGradient(b.x, b.y - b.len, b.x, b.y)
          : ctx.createLinearGradient(b.x - b.len, b.y, b.x, b.y);
        g.addColorStop(0, `rgba(${b.rgb},0)`);
        g.addColorStop(0.8, `rgba(${b.rgb},${b.op})`);
        g.addColorStop(1, `rgba(${b.rgb},${b.op * 1.5})`);
        ctx.strokeStyle = g;
        ctx.lineWidth = 1.5;
        ctx.shadowColor = `rgba(${b.rgb},0.7)`;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        if (b.vert) {
          ctx.moveTo(b.x, b.y - b.len); ctx.lineTo(b.x, b.y);
          b.y += b.spd;
          if (b.y - b.len > H) { b.y = 0; b.x = Math.floor((Math.random() * W) / CELL) * CELL; }
        } else {
          ctx.moveTo(b.x - b.len, b.y); ctx.lineTo(b.x, b.y);
          b.x += b.spd;
          if (b.x - b.len > W) { b.x = 0; b.y = Math.floor((Math.random() * H) / CELL) * CELL; }
        }
        ctx.stroke();
        ctx.restore();
      });
      rafId = requestAnimationFrame(draw);
    };

    draw();
    return () => { window.removeEventListener('resize', onResize); cancelAnimationFrame(rafId); };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" style={{ opacity: 0.45 }} />;
}

// ─── Login Form ────────────────────────────────────────────────────────────────
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/admin';

  const [email, setEmail] = useState('kiones91@gmail.com');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (err) {
        setError(err.message === 'Invalid login credentials' ? 'E-mail ou senha incorretos.' : err.message);
        setLoading(false);
        return;
      }
      if (data.user) { router.push(redirectTo); router.refresh(); }
    } catch {
      setError('Erro inesperado. Tente novamente.');
      setLoading(false);
    }
  };

  return (
    /* ── Wrapper: ocupa toda a tela e centraliza o card ── */
    <div className="relative z-10 w-full min-h-screen flex items-center justify-center px-4 py-10">

      {/* ── Outer circuit nodes (visíveis apenas em md+) ── */}
      <div className="pointer-events-none hidden md:block absolute inset-0">
        {/* node topo-esquerda */}
        <div className="absolute left-4 top-1/4 flex items-center gap-2 text-neutral-700">
          <div className="h-px w-8 bg-neutral-800" />
          <div className="relative h-9 w-16 rounded-xl bg-neutral-900/80 shadow-[0_0_0_1px_rgba(82,82,91,0.4)] flex items-center justify-center">
            <div className="h-1 w-10 rounded-full bg-neutral-700" />
            <span className="absolute -left-1 h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.65)] animate-pulse" />
          </div>
          <div className="h-px w-12 bg-neutral-800" />
        </div>
        {/* node baixo-esquerda */}
        <div className="absolute left-10 bottom-10 flex items-center gap-2 text-neutral-700">
          <div className="h-px w-8 bg-neutral-800" />
          <div className="relative h-9 w-20 rounded-xl bg-neutral-900/80 shadow-[0_0_0_1px_rgba(82,82,91,0.4)] flex items-center justify-center">
            <div className="flex gap-1"><span className="h-1 w-2 rounded bg-neutral-700" /><span className="h-1 w-2 rounded bg-neutral-700/60" /><span className="h-1 w-2 rounded bg-neutral-700/40" /></div>
            <span className="absolute -left-1 h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.65)] animate-pulse" />
          </div>
          <div className="h-px w-16 bg-neutral-800" />
        </div>
        {/* node topo-direita */}
        <div className="absolute right-4 top-1/5 flex items-center gap-2 text-neutral-700">
          <div className="h-px w-16 bg-neutral-800" />
          <div className="relative h-9 w-20 rounded-xl bg-neutral-900/80 shadow-[0_0_0_1px_rgba(82,82,91,0.4)] flex items-center justify-center">
            <span className="h-1 w-6 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.65)]" />
            <span className="absolute -right-1 h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.65)] animate-pulse" />
          </div>
          <div className="h-px w-8 bg-neutral-800" />
        </div>
        {/* node baixo-direita */}
        <div className="absolute right-8 bottom-16 flex items-center gap-2 text-neutral-700">
          <div className="h-px w-10 bg-neutral-800" />
          <div className="relative h-9 w-16 rounded-xl bg-neutral-900/80 shadow-[0_0_0_1px_rgba(82,82,91,0.4)] flex items-center justify-center">
            <div className="h-1 w-8 rounded-full bg-neutral-700" />
            <span className="absolute -right-1 h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.65)] animate-pulse" />
          </div>
          <div className="h-px w-8 bg-neutral-800" />
        </div>
      </div>

      {/* ── Card principal ── */}
      <div
        className="w-full max-w-md relative rounded-3xl border border-neutral-800 shadow-xl"
        style={{ background: 'linear-gradient(to bottom, #171c28, #111520, #0d1019)' }}
      >
        {/* top decorative bars */}
        <div className="absolute left-10 top-5 hidden h-1.5 w-16 rounded-full bg-neutral-700/60 sm:block" />
        <div className="absolute right-10 top-5 hidden h-1.5 w-10 rounded-full bg-neutral-700/30 sm:block" />

        <div className="px-6 pb-8 pt-8 sm:px-10 sm:pb-10">

          {/* ── Logo Icon ── */}
          <div className="flex justify-center">
            <div className="flex w-14 h-14 rounded-2xl bg-neutral-900 shadow-[0_0_0_1px_rgba(82,82,91,0.7)] items-center justify-center">
              <div className="flex w-10 h-10 rounded-2xl bg-neutral-950 items-center justify-center">
                {/* Zap / Raio SVG */}
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fcdc5d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 8px rgba(252,220,93,0.8))' }}>
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              </div>
            </div>
          </div>

          {/* ── Heading ── */}
          <div className="mt-6 text-center">
            <h1 className="text-[22px] leading-tight tracking-tight font-semibold text-neutral-50">
              TecManutenções ERP
            </h1>
            <p className="mt-2 text-sm font-normal text-neutral-400">
              Acesse seu painel operacional.{' '}
              <a
                href="https://wa.me/5519983808498?text=Preciso+de+ajuda+para+acessar+o+painel+TecManuten%C3%A7%C3%B5es"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-[#fcdc5d] hover:text-[#f5cb3c] transition-colors"
              >
                Precisa de ajuda?
              </a>
            </p>
          </div>

          {/* ── Error ── */}
          {error && (
            <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-red-800/60 bg-red-950/40 px-3.5 py-3 text-xs text-red-300">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <span>{error}</span>
            </div>
          )}

          {/* ── Form ── */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-xs font-medium uppercase tracking-[0.16em] text-neutral-400">
                E-mail de acesso
              </label>
              <div
                className="flex items-center rounded-xl border border-neutral-800 px-3 py-2.5 text-sm text-neutral-100 shadow-inner shadow-black/40 transition-all focus-within:border-[#fcdc5d]/60 focus-within:ring-1 focus-within:ring-[#fcdc5d]/40"
                style={{ background: 'rgba(10,12,22,0.6)' }}
              >
                {/* mail icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-neutral-500"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
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
                <a
                  href="https://wa.me/5519983808498?text=Esqueci+minha+senha+do+painel+TecManuten%C3%A7%C3%B5es"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-medium text-neutral-400 hover:text-neutral-100 transition-colors"
                >
                  Esqueceu?
                </a>
              </div>
              <div
                className="flex items-center rounded-xl border border-neutral-800 px-3 py-2.5 text-sm text-neutral-100 shadow-inner shadow-black/40 transition-all focus-within:border-[#fcdc5d]/60 focus-within:ring-1 focus-within:ring-[#fcdc5d]/40"
                style={{ background: 'rgba(10,12,22,0.6)' }}
              >
                {/* lock icon */}
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-neutral-500"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  className="ml-3 flex-1 bg-transparent text-sm font-normal text-neutral-100 placeholder:text-neutral-600 focus:outline-none font-mono tracking-wider"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="ml-2 rounded-full px-2 py-1 text-[11px] font-medium text-neutral-400 hover:bg-neutral-800/80 hover:text-neutral-100 transition"
                >
                  {showPass ? 'Ocultar' : 'Ver'}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-2.5">
              <input
                id="remember"
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4 rounded border-neutral-700 bg-neutral-900 accent-[#fcdc5d] cursor-pointer focus:ring-0 focus:ring-offset-0"
              />
              <label htmlFor="remember" className="cursor-pointer select-none text-xs text-neutral-400 hover:text-neutral-300 transition-colors">
                Manter conectado
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 inline-flex w-full items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold text-neutral-900 transition focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#fcdc5d]/80 disabled:opacity-60 cursor-pointer"
              style={{
                background: '#fcdc5d',
                boxShadow: '0 14px 35px rgba(252,220,93,0.45)',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#f5cb3c'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#fcdc5d'; }}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                  Autenticando...
                </span>
              ) : (
                'Acessar Painel'
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 text-xs text-neutral-500">
              <div className="h-px flex-1 bg-neutral-800/80" />
              <span className="font-medium">Acesso Rápido</span>
              <div className="h-px flex-1 bg-neutral-800/80" />
            </div>

            {/* Quick links */}
            <div className="grid grid-cols-3 gap-3">
              {/* WhatsApp */}
              <a
                href="https://wa.me/5519983808498"
                target="_blank"
                rel="noreferrer"
                className="flex flex-col items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900 px-2 py-2.5 text-xs font-medium text-neutral-200 transition hover:border-neutral-700 hover:bg-neutral-800/80"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#25D366" className="mb-1"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp
              </a>
              {/* Site */}
              <a
                href="https://tecmanutencao.vercel.app"
                target="_blank"
                rel="noreferrer"
                className="flex flex-col items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900 px-2 py-2.5 text-xs font-medium text-neutral-200 transition hover:border-neutral-700 hover:bg-neutral-800/80"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="mb-1"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                Site Oficial
              </a>
              {/* Atendimento */}
              <Link
                href="/atendimento"
                className="flex flex-col items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900 px-2 py-2.5 text-xs font-medium text-neutral-200 transition hover:border-neutral-700 hover:bg-neutral-800/80"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="mb-1"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z"/><path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>
                Atendimento
              </Link>
            </div>

            {/* Footer */}
            <p className="pt-1 text-[11px] leading-relaxed text-neutral-500 text-center">
              Ambiente seguro — dados criptografados com{' '}
              <span className="font-medium text-neutral-200">SSL 256-bit</span>
              {' '}· v3.4
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function LoginPage() {
  return (
    <main className="min-h-screen w-full antialiased text-neutral-100" style={{ background: '#0a0c14' }}>
      {/* Ambient radial glow centralizado */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background: 'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(252,220,93,0.07) 0%, rgba(52,211,153,0.04) 40%, transparent 70%)',
        }}
      />
      <NeonGridBackground />
      <Suspense
        fallback={
          <div className="fixed inset-0 z-20 flex flex-col items-center justify-center gap-3 text-slate-400">
            <svg className="animate-spin h-8 w-8 text-[#fcdc5d]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
            <span className="text-xs font-mono tracking-wider">Inicializando sessão segura...</span>
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </main>
  );
}
