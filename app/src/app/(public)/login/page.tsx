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
} from 'lucide-react';
import Link from 'next/link';

// Interactive background grid with subtle ambient neon beams
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

    interface Beam {
      x: number;
      y: number;
      length: number;
      speed: number;
      opacity: number;
      vertical: boolean;
      color: string;
    }

    const gridSize = 44;

    const beams: Beam[] = Array.from({ length: 16 }, () => ({
      x: Math.floor((Math.random() * width) / gridSize) * gridSize,
      y: Math.floor((Math.random() * height) / gridSize) * gridSize,
      length: Math.random() * 120 + 80,
      speed: Math.random() * 0.7 + 0.3,
      opacity: Math.random() * 0.4 + 0.2,
      vertical: Math.random() > 0.4,
      color: Math.random() > 0.4 ? '252, 220, 93' : '52, 211, 153',
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Matrix Grid Lines
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(35, 45, 66, 0.25)';

      for (let x = 0; x <= width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      for (let y = 0; y <= height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Animate Light Beams
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
        ctx.shadowBlur = 6;

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
      className="fixed inset-0 pointer-events-none z-0 opacity-50"
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
    <div className="w-full max-w-[450px] relative z-10 mx-auto px-4 py-6">
      {/* Central Glassmorphic Card */}
      <div className="relative w-full rounded-3xl p-7 sm:p-9 bg-gradient-to-b from-[#131926]/95 via-[#0d121c]/98 to-[#080c13] border border-[#232d42] shadow-[0_30px_70px_-15px_rgba(0,0,0,0.9),0_0_40px_rgba(252,220,93,0.06),inset_0_1px_1px_rgba(255,255,255,0.08)] backdrop-blur-2xl">
        
        {/* Top Status Glow Bars */}
        <div className="absolute left-8 top-3 hidden sm:block h-1.5 w-16 rounded-full bg-slate-700/50"></div>
        <div className="absolute right-8 top-3 hidden sm:block h-1.5 w-10 rounded-full bg-[#fcdc5d]/30"></div>

        {/* Brand Layered Glowing Icon Badge */}
        <div className="flex justify-center mb-6 mt-1">
          <div className="relative group">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#fcdc5d]/30 to-emerald-400/20 blur-md opacity-75 group-hover:opacity-100 transition duration-500"></div>
            <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-[#0e131f] border border-[#28354d] shadow-[0_0_20px_rgba(252,220,93,0.15)]">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#070a12] border border-[#1b2537]">
                <Zap className="w-5 h-5 text-[#fcdc5d] drop-shadow-[0_0_8px_rgba(252,220,93,0.8)]" />
              </div>
            </div>
          </div>
        </div>

        {/* Header Title Section */}
        <div className="text-center mb-7">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141d2e] border border-[#243147] text-[11px] font-semibold text-emerald-400 mb-3 shadow-inner">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)] animate-pulse"></span>
            <span>Área Segura • SSL 256-bit</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-outfit text-white tracking-tight">
            TecManutenções ERP
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1.5 leading-relaxed">
            Painel operacional e automação industrial MDK
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-6 p-3.5 rounded-2xl bg-red-950/50 border border-red-800/70 flex items-start gap-2.5 text-red-300 text-xs shadow-lg animate-in fade-in zoom-in-95 duration-200">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span className="leading-snug">{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email Field */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-xs font-semibold uppercase tracking-[0.14em] text-slate-300"
            >
              E-mail de Acesso
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu.email@empresa.com"
                className="w-full h-12 pl-11 pr-4 rounded-2xl bg-[#070a12] border border-[#232d42] text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#fcdc5d] focus:ring-1 focus:ring-[#fcdc5d]/50 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-xs font-semibold uppercase tracking-[0.14em] text-slate-300"
              >
                Senha de Segurança
              </label>
              <a
                href="https://wa.me/5519983808498?text=Ol%C3%A1,%20esqueci%20minha%20senha%20do%20painel%20TecManuten%C3%A7%C3%B5es"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-medium text-slate-400 hover:text-[#fcdc5d] transition-colors"
              >
                Esqueceu?
              </a>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="password"
                type={mostrarSenha ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full h-12 pl-11 pr-20 rounded-2xl bg-[#070a12] border border-[#232d42] text-sm font-mono text-white placeholder:text-slate-600 focus:outline-none focus:border-[#fcdc5d] focus:ring-1 focus:ring-[#fcdc5d]/50 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] tracking-wider"
              />
              <button
                type="button"
                onClick={() => setMostrarSenha(!mostrarSenha)}
                className="absolute right-3 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-xl text-xs font-medium text-slate-400 hover:bg-[#141b29] hover:text-white transition-all flex items-center gap-1"
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

          {/* Remember me & Help */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2.5 text-xs text-slate-400 cursor-pointer select-none group">
              <input
                type="checkbox"
                checked={lembrarDeMim}
                onChange={(e) => setLembrarDeMim(e.target.checked)}
                className="w-4 h-4 rounded bg-[#070a12] border-[#232d42] text-[#fcdc5d] focus:ring-0 focus:ring-offset-0 accent-[#fcdc5d] transition-all cursor-pointer"
              />
              <span className="group-hover:text-slate-300 transition-colors">
                Manter conectado
              </span>
            </label>
            <a
              href="https://wa.me/5519983808498?text=Preciso%20de%20ajuda%20para%20acessar%20o%20painel%20TecManuten%C3%A7%C3%B5es"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-slate-400 hover:text-[#fcdc5d] transition-colors"
            >
              Precisa de ajuda?
            </a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 mt-2 rounded-full bg-[#fcdc5d] hover:bg-[#f5cb3c] text-[#0a0d14] font-extrabold text-sm tracking-wide flex items-center justify-center gap-2 shadow-[0_10px_28px_rgba(252,220,93,0.35)] hover:shadow-[0_14px_35px_rgba(252,220,93,0.5)] active:scale-[0.98] transition-all duration-200 disabled:opacity-60 cursor-pointer"
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

        {/* Divider */}
        <div className="flex items-center gap-3 my-7 text-[11px] text-slate-500 uppercase tracking-widest font-medium">
          <div className="h-px flex-1 bg-[#232d42]"></div>
          <span>Acesso Rápido & Suporte</span>
          <div className="h-px flex-1 bg-[#232d42]"></div>
        </div>

        {/* Quick Access Support Buttons */}
        <div className="grid grid-cols-3 gap-2.5">
          <a
            href="https://wa.me/5519983808498"
            target="_blank"
            rel="noreferrer"
            className="flex flex-col items-center justify-center py-2.5 px-2 rounded-2xl border border-[#232d42] bg-[#090d14] hover:bg-[#131926] hover:border-[#fcdc5d]/50 text-slate-300 hover:text-white transition-all group text-center"
            title="Suporte Técnico no WhatsApp"
          >
            <MessageSquareText className="w-4 h-4 text-[#fcdc5d] group-hover:scale-110 transition-transform mb-1" />
            <span className="text-[11px] font-semibold">WhatsApp</span>
          </a>

          <a
            href="https://tecmanutencao.vercel.app"
            target="_blank"
            rel="noreferrer"
            className="flex flex-col items-center justify-center py-2.5 px-2 rounded-2xl border border-[#232d42] bg-[#090d14] hover:bg-[#131926] hover:border-emerald-400/50 text-slate-300 hover:text-white transition-all group text-center"
            title="Abrir site oficial"
          >
            <Globe className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform mb-1" />
            <span className="text-[11px] font-semibold">Site Oficial</span>
          </a>

          <Link
            href="/atendimento"
            className="flex flex-col items-center justify-center py-2.5 px-2 rounded-2xl border border-[#232d42] bg-[#090d14] hover:bg-[#131926] hover:border-sky-400/50 text-slate-300 hover:text-white transition-all group text-center"
            title="Central de Atendimento"
          >
            <Headphones className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform mb-1" />
            <span className="text-[11px] font-semibold">Atendimento</span>
          </Link>
        </div>

        {/* Footer info */}
        <div className="mt-7 pt-4 border-t border-[#232d42]/60 flex items-center justify-between text-[11px] text-slate-500">
          <span>v3.4 · Core ERP</span>
          <span className="flex items-center gap-1 text-emerald-400/90 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Protegido por SSL
          </span>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen w-full bg-[#05080a] flex items-center justify-center relative overflow-hidden p-4">
      {/* Background Ambient Radial Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-b from-[#fcdc5d]/8 via-emerald-500/5 to-transparent blur-[140px] pointer-events-none rounded-full" />
      
      {/* Neon Matrix Grid Canvas */}
      <NeonGridBackground />

      <Suspense
        fallback={
          <div className="relative z-10 flex flex-col items-center gap-3 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-[#fcdc5d]" />
            <span className="text-xs font-mono tracking-wider">INICIALIZANDO LOGIN SEGURO...</span>
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </main>
  );
}
