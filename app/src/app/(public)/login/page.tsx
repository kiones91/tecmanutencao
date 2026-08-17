'use client';

import { useState, Suspense, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  ShieldCheck,
  Zap,
  Globe,
  MessageSquareText,
  Headphones,
  Cpu,
} from 'lucide-react';
import Link from 'next/link';

// Interactive background grid canvas with subtle ambient neon beams
function NeonGridBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particles/beams animation
    interface Beam {
      x: number;
      y: number;
      length: number;
      speed: number;
      opacity: number;
      vertical: boolean;
      color: string;
    }

    const beams: Beam[] = Array.from({ length: 18 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      length: Math.random() * 140 + 60,
      speed: Math.random() * 0.8 + 0.3,
      opacity: Math.random() * 0.5 + 0.2,
      vertical: Math.random() > 0.4,
      color: Math.random() > 0.4 ? '252, 220, 93' : '52, 211, 153', // Brand yellow & emerald
    }));

    const gridSize = 48;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Perspective / Flat Matrix Grid Lines
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(35, 43, 62, 0.35)';

      const startX = 0;
      const startY = 0;

      for (let x = startX; x <= width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      for (let y = startY; y <= height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 2. Animate Grid Beams along grid lines
      beams.forEach((beam) => {
        ctx.save();
        const gradient = beam.vertical
          ? ctx.createLinearGradient(beam.x, beam.y - beam.length, beam.x, beam.y)
          : ctx.createLinearGradient(beam.x - beam.length, beam.y, beam.x, beam.y);

        gradient.addColorStop(0, `rgba(${beam.color}, 0)`);
        gradient.addColorStop(0.8, `rgba(${beam.color}, ${beam.opacity})`);
        gradient.addColorStop(1, `rgba(${beam.color}, ${beam.opacity * 1.5})`);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.5;
        ctx.shadowColor = `rgba(${beam.color}, 0.8)`;
        ctx.shadowBlur = 8;

        ctx.beginPath();
        if (beam.vertical) {
          ctx.moveTo(beam.x, beam.y - beam.length);
          ctx.lineTo(beam.x, beam.y);
          beam.y += beam.speed;
          if (beam.y - beam.length > height) {
            beam.y = 0;
            beam.x = Math.floor((Math.random() * width) / gridSize) * gridSize;
          }
        } else {
          ctx.moveTo(beam.x - beam.length, beam.y);
          ctx.lineTo(beam.x, beam.y);
          beam.x += beam.speed;
          if (beam.x - beam.length > width) {
            beam.x = 0;
            beam.y = Math.floor((Math.random() * height) / gridSize) * gridSize;
          }
        }
        ctx.stroke();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-60 mix-blend-screen"
    />
  );
}

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
            ? 'E-mail ou senha incorretos. Verifique suas credenciais de acesso.'
            : error.message
        );
        setLoading(false);
        return;
      }

      if (data.user) {
        router.push(redirectTo);
        router.refresh();
      }
    } catch {
      setErrorMsg('Ocorreu um erro inesperado ao autenticar. Tente novamente.');
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto my-4 sm:my-8 px-3 sm:px-4 z-10">
      {/* Outer Circuit Style Nodes with connecting lines (NeonGrid design signature) */}
      <div className="pointer-events-none hidden lg:block absolute inset-0">
        {/* Left Upper Node */}
        <div className="absolute left-2 top-[22%] flex items-center gap-2 text-slate-600">
          <div className="h-px flex-1 bg-[#232d42] translate-x-2"></div>
          <div className="relative h-10 w-20 rounded-xl bg-[#0f141f]/90 border border-[#232d42]/80 shadow-[0_0_15px_rgba(0,0,0,0.5)] flex items-center justify-center backdrop-blur-md">
            <div className="h-1 w-11 rounded-full bg-slate-700/80"></div>
            {/* Pulsing Chip LED */}
            <span className="absolute -left-1 h-1.5 w-1.5 rounded-full bg-[#fcdc5d] shadow-[0_0_10px_rgba(252,220,93,0.9)] animate-pulse"></span>
          </div>
          {/* Line to card */}
          <div className="h-px w-14 bg-gradient-to-r from-[#232d42] to-[#fcdc5d]/40"></div>
        </div>

        {/* Left Bottom Node */}
        <div className="absolute left-8 bottom-[18%] flex items-center gap-2 text-slate-600">
          <div className="h-px flex-1 bg-[#232d42] translate-x-2"></div>
          <div className="relative h-10 w-24 rounded-xl bg-[#0f141f]/90 border border-[#232d42]/80 shadow-[0_0_15px_rgba(0,0,0,0.5)] flex items-center justify-center backdrop-blur-md">
            <div className="flex gap-1.5">
              <span className="h-1 w-3 rounded bg-emerald-400/90 shadow-[0_0_8px_rgba(52,211,153,0.6)]"></span>
              <span className="h-1 w-3 rounded bg-[#fcdc5d]/80 shadow-[0_0_8px_rgba(252,220,93,0.6)]"></span>
              <span className="h-1 w-3 rounded bg-slate-700/60"></span>
            </div>
            {/* Pulsing Chip LED */}
            <span className="absolute -left-1 h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)] animate-pulse"></span>
          </div>
          {/* Line to card */}
          <div className="h-px w-20 bg-gradient-to-r from-[#232d42] to-emerald-400/40"></div>
        </div>

        {/* Right Upper Node */}
        <div className="absolute right-2 top-[18%] flex items-center gap-2 text-slate-600">
          {/* Line to card */}
          <div className="h-px w-20 bg-gradient-to-l from-[#232d42] to-[#fcdc5d]/40"></div>
          <div className="relative h-10 w-24 rounded-xl bg-[#0f141f]/90 border border-[#232d42]/80 shadow-[0_0_15px_rgba(0,0,0,0.5)] flex items-center justify-center backdrop-blur-md">
            <div className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-[#fcdc5d]" />
              <span className="h-1 w-7 rounded-full bg-[#fcdc5d] shadow-[0_0_8px_rgba(252,220,93,0.8)]"></span>
            </div>
            {/* Pulsing Chip LED */}
            <span className="absolute -right-1 h-1.5 w-1.5 rounded-full bg-[#fcdc5d] shadow-[0_0_10px_rgba(252,220,93,0.9)] animate-pulse"></span>
          </div>
          <div className="h-px flex-1 bg-[#232d42] -translate-x-2"></div>
        </div>

        {/* Right Bottom Node */}
        <div className="absolute right-6 bottom-[22%] flex items-center gap-2 text-slate-600">
          {/* Line to card */}
          <div className="h-px w-14 bg-gradient-to-l from-[#232d42] to-emerald-400/40"></div>
          <div className="relative h-10 w-20 rounded-xl bg-[#0f141f]/90 border border-[#232d42]/80 shadow-[0_0_15px_rgba(0,0,0,0.5)] flex items-center justify-center backdrop-blur-md">
            <div className="h-1 w-10 rounded-full bg-slate-700"></div>
            {/* Pulsing Chip LED */}
            <span className="absolute -right-1 h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)] animate-pulse"></span>
          </div>
          <div className="h-px flex-1 bg-[#232d42] -translate-x-2"></div>
        </div>
      </div>

      {/* Main Glassmorphic Cyber Card */}
      <div className="relative max-w-[430px] mx-auto rounded-3xl p-6 sm:p-9 bg-gradient-to-b from-[#141926]/95 via-[#0e131d]/95 to-[#090d14]/98 border border-[#232d42] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_35px_rgba(252,220,93,0.06),inset_0_1px_1px_rgba(255,255,255,0.08)] backdrop-blur-xl transition-all duration-300">
        
        {/* Top Glow Accent Dots */}
        <div className="absolute left-10 top-3 hidden sm:block h-1.5 w-16 rounded-full bg-gradient-to-r from-slate-700/60 to-transparent"></div>
        <div className="absolute right-10 top-3 hidden sm:block h-1.5 w-10 rounded-full bg-gradient-to-l from-[#fcdc5d]/40 to-transparent"></div>

        {/* Brand Futuristic Logo Badge with layered rings */}
        <div className="flex justify-center mb-5">
          <div className="relative group">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#fcdc5d]/30 to-emerald-400/20 blur-md opacity-75 group-hover:opacity-100 transition duration-500"></div>
            <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-[#0e131e] border border-[#26334a] shadow-[0_0_18px_rgba(252,220,93,0.15)]">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#080b12] border border-[#1b2537]">
                <Zap className="w-5 h-5 text-[#fcdc5d] drop-shadow-[0_0_8px_rgba(252,220,93,0.8)]" />
              </div>
            </div>
          </div>
        </div>

        {/* Header Title & Subtitle */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#162032]/80 border border-[#232d42] text-[11px] font-semibold text-emerald-400 mb-2.5 shadow-inner">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)] animate-pulse"></span>
            <span>Área Segura • SSL 256-bit</span>
          </div>
          <h1 className="text-2xl sm:text-[26px] font-bold font-outfit text-white tracking-tight leading-tight">
            TecManutenções ERP
          </h1>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
            Painel operacional e automação industrial
          </p>
        </div>

        {/* Error Alert Box */}
        {errorMsg && (
          <div className="mb-5 p-3.5 rounded-2xl bg-red-950/40 border border-red-800/60 flex items-start gap-2.5 text-red-300 text-xs shadow-lg animate-in fade-in zoom-in-95 duration-200">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span className="leading-snug">{errorMsg}</span>
          </div>
        )}

        {/* Form Container */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email Input Field */}
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400"
            >
              E-mail de Acesso
            </label>
            <div className="flex items-center rounded-xl border border-[#232d42] bg-[#070a11]/90 px-3.5 py-3 text-sm text-slate-100 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] focus-within:border-[#fcdc5d] focus-within:ring-1 focus-within:ring-[#fcdc5d]/40 focus-within:shadow-[0_0_15px_rgba(252,220,93,0.12)] transition-all">
              <Mail className="w-4 h-4 text-slate-500 shrink-0" />
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu.email@empresa.com"
                className="ml-3 flex-1 bg-transparent text-xs sm:text-sm font-normal text-white placeholder:text-slate-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Password Input Field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400"
              >
                Senha de Segurança
              </label>
              <a
                href="https://wa.me/5519983808498?text=Ol%C3%A1,%20esqueci%20minha%20senha%20do%20painel%20TecManuten%C3%A7%C3%B5es"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-medium text-slate-400 hover:text-[#fcdc5d] transition-colors"
              >
                Esqueceu?
              </a>
            </div>
            <div className="flex items-center rounded-xl border border-[#232d42] bg-[#070a11]/90 px-3.5 py-3 text-sm text-slate-100 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] focus-within:border-[#fcdc5d] focus-within:ring-1 focus-within:ring-[#fcdc5d]/40 focus-within:shadow-[0_0_15px_rgba(252,220,93,0.12)] transition-all">
              <Lock className="w-4 h-4 text-slate-500 shrink-0" />
              <input
                id="password"
                type={mostrarSenha ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="ml-3 flex-1 bg-transparent text-xs sm:text-sm font-mono text-white placeholder:text-slate-600 focus:outline-none tracking-wider"
              />
              <button
                type="button"
                onClick={() => setMostrarSenha(!mostrarSenha)}
                className="ml-2 rounded-full px-2 py-0.5 text-[11px] font-medium text-slate-400 hover:bg-[#162032] hover:text-white transition-all flex items-center gap-1"
                aria-label={mostrarSenha ? 'Ocultar senha' : 'Exibir senha'}
              >
                {mostrarSenha ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>Ocultar</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    <span>Ver</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Remember me & Quick Support */}
          <div className="flex items-center justify-between pt-1 text-xs">
            <label className="flex items-center gap-2 text-slate-400 cursor-pointer select-none group">
              <input
                type="checkbox"
                checked={lembrarDeMim}
                onChange={(e) => setLembrarDeMim(e.target.checked)}
                className="w-4 h-4 rounded bg-[#070a11] border-[#232d42] text-[#fcdc5d] focus:ring-0 focus:ring-offset-0 accent-[#fcdc5d] transition-all cursor-pointer"
              />
              <span className="text-[11px] sm:text-xs group-hover:text-slate-300 transition-colors">
                Manter conectado
              </span>
            </label>
            <a
              href="https://wa.me/5519983808498?text=Preciso%20de%20ajuda%20para%20acessar%20o%20painel%20TecManuten%C3%A7%C3%B5es"
              target="_blank"
              rel="noreferrer"
              className="text-[11px] sm:text-xs text-slate-400 hover:text-[#fcdc5d] transition-colors"
            >
              Precisa de ajuda?
            </a>
          </div>

          {/* Primary Action Button (Neon High-Luminescence Style) */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-3 py-3.5 px-4 rounded-full bg-[#fcdc5d] hover:bg-[#f5cb3c] text-[#0a0d14] font-bold text-sm tracking-wide flex items-center justify-center gap-2 shadow-[0_12px_32px_rgba(252,220,93,0.3)] hover:shadow-[0_16px_40px_rgba(252,220,93,0.45)] active:scale-[0.98] transition-all duration-200 disabled:opacity-60 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#0a0d14]" />
                <span>Autenticando sessão...</span>
              </>
            ) : (
              <>
                <span>Acessar Painel</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Circuit-style Divider */}
        <div className="flex items-center gap-3 my-6 text-[11px] text-slate-500 uppercase tracking-widest font-medium">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#232d42] to-[#232d42]"></div>
          <span>Acesso Rápido & Suporte</span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent via-[#232d42] to-[#232d42]"></div>
        </div>

        {/* Quick Access Grid Buttons (NeonGrid 3-col format) */}
        <div className="grid grid-cols-3 gap-2.5">
          <a
            href="https://wa.me/5519983808498"
            target="_blank"
            rel="noreferrer"
            className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-[#232d42] bg-[#0c1018]/80 hover:bg-[#151c2a] hover:border-[#fcdc5d]/50 text-slate-300 hover:text-white transition-all group shadow-sm text-center"
            title="Suporte Técnico no WhatsApp"
          >
            <MessageSquareText className="w-4 h-4 text-[#fcdc5d] group-hover:scale-110 transition-transform mb-1" />
            <span className="text-[10px] font-semibold">WhatsApp</span>
          </a>

          <a
            href="https://tecmanutencao.vercel.app"
            target="_blank"
            rel="noreferrer"
            className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-[#232d42] bg-[#0c1018]/80 hover:bg-[#151c2a] hover:border-emerald-400/50 text-slate-300 hover:text-white transition-all group shadow-sm text-center"
            title="Abrir site oficial"
          >
            <Globe className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform mb-1" />
            <span className="text-[10px] font-semibold">Site Oficial</span>
          </a>

          <Link
            href="/atendimento"
            className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-[#232d42] bg-[#0c1018]/80 hover:bg-[#151c2a] hover:border-sky-400/50 text-slate-300 hover:text-white transition-all group shadow-sm text-center"
            title="Central de Atendimento"
          >
            <Headphones className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform mb-1" />
            <span className="text-[10px] font-semibold">Atendimento</span>
          </Link>
        </div>

        {/* Card Subtext / Terms */}
        <p className="mt-5 pt-3 border-t border-[#232d42]/60 text-center text-[10px] text-slate-500 leading-relaxed">
          Ao continuar, você concorda com os termos de segurança e políticas de privacidade da{' '}
          <span className="text-slate-400 font-medium">TecManutenções Industrial</span>.
        </p>

        {/* System Version & SSL Badge */}
        <div className="mt-3 flex items-center justify-between text-[10px] text-slate-500">
          <span className="font-mono">v3.4 · Core ERP</span>
          <span className="flex items-center gap-1 text-emerald-400/90 font-medium">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            Conexão Criptografada
          </span>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="relative min-h-screen w-full bg-[#06080e] flex items-center justify-center overflow-x-hidden p-3 sm:p-6 select-none">
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-gradient-to-b from-[#fcdc5d]/10 via-emerald-500/5 to-transparent blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 right-10 w-[350px] h-[250px] bg-emerald-500/5 blur-[100px] pointer-events-none rounded-full" />
      <div className="absolute top-10 left-10 w-[350px] h-[250px] bg-sky-500/5 blur-[100px] pointer-events-none rounded-full" />

      {/* Neon Matrix Grid Canvas */}
      <NeonGridBackground />

      <Suspense
        fallback={
          <div className="relative z-10 flex flex-col items-center gap-3 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-[#fcdc5d]" />
            <span className="text-xs font-mono tracking-wider">INICIALIZANDO ACESSO SEGURO...</span>
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </main>
  );
}
