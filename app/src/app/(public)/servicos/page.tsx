import Link from 'next/link';
import { Wrench, Shield, Cpu, Zap, ArrowRight, CheckCircle2, Clock, Factory } from 'lucide-react';

export const metadata = {
  title: 'Serviços de Engenharia e Automação | TecManutenções',
  description: 'Adequação NR12, Automação & Retrofit, Paradas Programadas e Contratos de Manutenção Industrial.',
};

export default function ServicosPage() {
  return (
    <div className="min-h-screen bg-[#0a0d14] text-[#f8fafc] flex flex-col">
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
            <Link href="/" className="text-[#94a3b8] hover:text-white transition-colors">Início</Link>
            <Link href="/servicos" className="text-[#fcdc5d] font-bold">Serviços</Link>
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
      <section className="py-16 px-4 bg-gradient-to-b from-[#111622] to-[#0a0d14] border-b border-[#232b3e]">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-xs font-mono uppercase tracking-widest text-[#fcdc5d] bg-[#fcdc5d]/10 px-3 py-1 rounded-full border border-[#fcdc5d]/30">
            Nossas Especialidades
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold font-outfit text-white mt-4 mb-4">
            Engenharia de Alto Padrão para sua Indústria
          </h1>
          <p className="text-sm sm:text-base text-[#94a3b8] max-w-2xl mx-auto">
            Projetos turnkey com ART, montagens certificadas e garantia de 90 dias com auditoria técnica.
          </p>
        </div>
      </section>

      {/* Grid de Serviços */}
      <section className="py-16 px-4 max-w-6xl mx-auto flex-1 space-y-12">
        {/* Serviço 1: NR12 */}
        <div className="bg-[#161c2c] rounded-2xl p-8 border border-[#232b3e] grid grid-cols-1 md:grid-cols-2 gap-8 items-center shadow-xl">
          <div>
            <div className="w-12 h-12 rounded-xl bg-[#fcdc5d]/10 border border-[#fcdc5d]/30 flex items-center justify-center text-[#fcdc5d] mb-4">
              <Shield className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold font-outfit text-white mb-3">Adequação NR-12 Turnkey</h2>
            <p className="text-xs sm:text-sm text-[#94a3b8] leading-relaxed mb-4">
              Apreciação de risco (HRN), projeto mecânico e elétrico, instalação de cortinas de luz, relés de segurança, travas intertravadas e emissão de laudo técnico com ART do CREA.
            </p>
            <ul className="space-y-2 text-xs text-[#f8fafc] mb-6">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#fcdc5d]" />
                <span>Apreciação completa em 4 dias (campo + escritório)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#fcdc5d]" />
                <span>Projetos 100% blindados contra autuações do MTE</span>
              </li>
            </ul>
            <Link
              href="/atendimento"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#0a0d14] bg-[#fcdc5d] hover:bg-[#f5cb3c] px-5 py-3 rounded-xl transition-all shadow"
            >
              <span>Solicitar Adequação NR12</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="rounded-2xl overflow-hidden border border-[#232b3e] aspect-video bg-[#111622]">
            <img
              src="/assets/hero_panel_1786474005771.png"
              alt="Painel NR12"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Serviço 2: Automação & Retrofit */}
        <div className="bg-[#161c2c] rounded-2xl p-8 border border-[#232b3e] grid grid-cols-1 md:grid-cols-2 gap-8 items-center shadow-xl">
          <div className="order-2 md:order-1 rounded-2xl overflow-hidden border border-[#232b3e] aspect-video bg-[#111622]">
            <img
              src="/assets/automation_tech_1786474016027.png"
              alt="Automação Industrial"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="order-1 md:order-2">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-4">
              <Cpu className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold font-outfit text-white mb-3">Automação & Retrofit de Máquinas</h2>
            <p className="text-xs sm:text-sm text-[#94a3b8] leading-relaxed mb-4">
              Modernização de máquinas antigas com CLP de última geração, IHM touchscreen, servoacionamentos e telemetria. Sua máquina com produtividade de nova por uma fração do investimento.
            </p>
            <ul className="space-y-2 text-xs text-[#f8fafc] mb-6">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                <span>Programação Siemens, Rockwell, Schneider e Delta</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                <span>Economia de até 70% comparado à compra de máquina nova</span>
              </li>
            </ul>
            <Link
              href="/atendimento"
              className="inline-flex items-center gap-2 text-xs font-bold text-white bg-[#111622] hover:bg-[#1f283d] border border-[#232b3e] px-5 py-3 rounded-xl transition-all"
            >
              <span>Orçar Retrofit</span>
              <ArrowRight className="w-4 h-4 text-[#fcdc5d]" />
            </Link>
          </div>
        </div>

        {/* Serviço 3: Paradas de Manutenção */}
        <div className="bg-[#161c2c] rounded-2xl p-8 border border-[#232b3e] grid grid-cols-1 md:grid-cols-2 gap-8 items-center shadow-xl">
          <div>
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold font-outfit text-white mb-3">Paradas Programadas de Fábrica</h2>
            <p className="text-xs sm:text-sm text-[#94a3b8] leading-relaxed mb-4">
              Equipe dedicada em regime de força-tarefa 24h para revisão geral de quadros de distribuição (QGBT), subestações, barramentos, readequação de cabos e termografia infravermelha.
            </p>
            <ul className="space-y-2 text-xs text-[#f8fafc] mb-6">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-orange-400" />
                <span>Laudo termográfico e relatório de condição inclusos</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-orange-400" />
                <span>Zero impacto no cronograma de produção da fábrica</span>
              </li>
            </ul>
            <Link
              href="/atendimento"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#0a0d14] bg-[#fcdc5d] hover:bg-[#f5cb3c] px-5 py-3 rounded-xl transition-all shadow"
            >
              <span>Agendar Parada Programada</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="rounded-2xl overflow-hidden border border-[#232b3e] aspect-video bg-[#111622]">
            <img
              src="/assets/factory_floor_1786474026652.png"
              alt="Piso de Fábrica"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#232b3e] bg-[#111622] py-8 px-4 text-center text-xs text-[#94a3b8]">
        <p>© {new Date().getFullYear()} TecManutenções / Ecosistema MDK. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
