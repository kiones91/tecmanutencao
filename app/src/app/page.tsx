import Link from 'next/link';
import { Wrench, Shield, ArrowRight, CheckCircle2, Cpu, Zap, Factory } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0d14] text-[#f8fafc] flex flex-col">
      {/* Header */}
      <header className="border-b border-[#232b3e] bg-[#111622]/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#fcdc5d]/10 border border-[#fcdc5d]/30 flex items-center justify-center">
              <Wrench className="w-5 h-5 text-[#fcdc5d]" />
            </div>
            <div>
              <span className="text-base font-bold font-outfit text-white block leading-none">TecManutenções</span>
              <span className="text-[10px] text-[#94a3b8]">Engenharia & Automação</span>
            </div>
          </Link>

          <nav className="flex items-center gap-6 text-xs font-semibold">
            <Link href="/servicos" className="text-[#94a3b8] hover:text-white transition-colors">Serviços</Link>
            <Link href="/portfolio" className="text-[#94a3b8] hover:text-white transition-colors">Portfólio</Link>
            <Link href="/atendimento" className="text-[#94a3b8] hover:text-[#fcdc5d] transition-colors">Atendimento</Link>
            <Link
              href="/login"
              className="px-3.5 py-1.5 rounded-xl bg-[#161c2c] hover:bg-[#1f283d] border border-[#232b3e] text-[#94a3b8] hover:text-white"
            >
              Área do Sócio
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-4 py-20 bg-gradient-to-b from-[#111622] via-[#0a0d14] to-[#0a0d14]">
        <div className="max-w-4xl mx-auto text-center">
          {/* Tag */}
          <div className="mb-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#fcdc5d]/10 border border-[#fcdc5d]/30 text-xs text-[#fcdc5d] font-mono">
            <span className="w-2 h-2 rounded-full bg-[#fcdc5d] animate-pulse"></span>
            <span>Engenharia Especializada & Gestão de Manutenção</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-6xl font-extrabold font-outfit text-white leading-tight mb-6">
            Engenharia Elétrica e <br />
            <span className="text-[#fcdc5d]">Automação Industrial</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-[#94a3b8] mb-10 max-w-2xl mx-auto leading-relaxed">
            Projetos turnkey de adequação NR-12, retrofit de máquinas industriais, paradas programadas e contratos preventivos com garantia técnica de 90 dias.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/atendimento"
              className="w-full sm:w-auto px-8 py-4 bg-[#fcdc5d] hover:bg-[#f5cb3c] text-[#0a0d14] font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#fcdc5d]/20 active:scale-98"
            >
              <Shield className="w-5 h-5" />
              <span>Solicitar Atendimento Imediato</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/servicos"
              className="w-full sm:w-auto px-8 py-4 bg-[#161c2c] hover:bg-[#1f283d] border border-[#232b3e] text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-all"
            >
              <span>Conhecer Nossos Serviços</span>
            </Link>
          </div>

          {/* Trust Highlights */}
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="bg-[#161c2c] rounded-2xl p-5 border border-[#232b3e]">
              <p className="text-2xl font-bold text-[#fcdc5d] font-outfit">NR-12</p>
              <p className="text-xs text-[#94a3b8] mt-1">Adequação Turnkey</p>
            </div>
            <div className="bg-[#161c2c] rounded-2xl p-5 border border-[#232b3e]">
              <p className="text-2xl font-bold text-[#fcdc5d] font-outfit">24/7</p>
              <p className="text-xs text-[#94a3b8] mt-1">Paradas Programadas</p>
            </div>
            <div className="bg-[#161c2c] rounded-2xl p-5 border border-[#232b3e]">
              <p className="text-2xl font-bold text-[#fcdc5d] font-outfit">Retrofit</p>
              <p className="text-xs text-[#94a3b8] mt-1">Automação & CLPs</p>
            </div>
            <div className="bg-[#161c2c] rounded-2xl p-5 border border-[#232b3e]">
              <p className="text-2xl font-bold text-[#fcdc5d] font-outfit">90 Dias</p>
              <p className="text-xs text-[#94a3b8] mt-1">Garantia Certificada</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#232b3e] bg-[#111622] py-8 px-4 text-center text-xs text-[#94a3b8]">
        <p>© {new Date().getFullYear()} TecManutenções Engenharia e Automação Industrial. Todos os direitos reservados.</p>
      </footer>
    </main>
  );
}
