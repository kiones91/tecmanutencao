import Link from 'next/link';
import { Wrench, ArrowRight, CheckCircle2, ShieldCheck, Factory, Zap, ExternalLink } from 'lucide-react';

export const metadata = {
  title: 'Portfólio de Obras e Projetos | TecManutenções',
  description: 'Casos reais de sucesso em adequação NR12, montagem de painéis, automação e paradas industriais.',
};

const PROJETOS_PORTFOLIO = [
  {
    id: 1,
    titulo: 'Adequação NR-12 em Prensa Hidráulica 300T',
    cliente: 'Cerâmica São Paulo',
    categoria: 'NR-12',
    imagem: '/assets/hero_panel_1786474005771.png',
    descricao: 'Instalação completa de cortinas de luz de segurança Tipo 4, válvulas de segurança monitoradas redundantes e painel elétrico IP65 em conformidade com o MTE.',
    resultado: '100% de conformidade legal e zero acidentes.',
  },
  {
    id: 2,
    titulo: 'Retrofit e Telemetria em Linha de Envase',
    cliente: 'Indústria Química Regional',
    categoria: 'Automação',
    imagem: '/assets/automation_tech_1786474016027.png',
    descricao: 'Substituição de CLP obsoleto por Siemens S7-1200 com IHM KTP700 e integração com supervisório industrial para monitoramento de OEE em tempo real.',
    resultado: '+28% de ganho de velocidade e diagnóstico instantâneo de falhas.',
  },
  {
    id: 3,
    titulo: 'Revisão Geral e QGBT em Parada Programada 72h',
    cliente: 'Complexo Industrial Metalmecânico',
    categoria: 'Paradas',
    imagem: '/assets/factory_floor_1786474026652.png',
    descricao: 'Força-tarefa de 7 técnicos para reaperto de barramentos com torquímetro, limpeza técnica criogênica, ensaio de isolamento e termografia em 18 quadros.',
    resultado: 'Relatório termográfico entregue com laudo técnico e sem paradas não planejadas.',
  },
  {
    id: 4,
    titulo: 'Montagem de Infraestrutura e Leitos de Cabos',
    cliente: 'Obra Fabril Rio Claro',
    categoria: 'Instalações',
    imagem: '/assets/equipe_unida.png',
    descricao: 'Passagem de 1.800m de cabos 50mm e 95mm, eletrocalhas perfuradas, SPDA e aterramento com laudo de resistividade do solo.',
    resultado: 'Entrega 4 dias antes do prazo acordado.',
  },
];

export default function PortfolioPage() {
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
            <Link href="/servicos" className="text-[#94a3b8] hover:text-white transition-colors">Serviços</Link>
            <Link href="/portfolio" className="text-[#fcdc5d] font-bold">Portfólio</Link>
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
            Casos de Sucesso
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold font-outfit text-white mt-4 mb-4">
            Projetos Executados com Excelência Técnica
          </h1>
          <p className="text-sm sm:text-base text-[#94a3b8] max-w-2xl mx-auto">
            Conheça algumas das soluções que entregamos para a indústria regional com precisão, segurança e garantia de 90 dias.
          </p>
        </div>
      </section>

      {/* Galeria de Projetos */}
      <section className="py-16 px-4 max-w-6xl mx-auto flex-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {PROJETOS_PORTFOLIO.map((p) => (
            <div
              key={p.id}
              className="bg-[#161c2c] rounded-2xl overflow-hidden border border-[#232b3e] shadow-xl flex flex-col justify-between group hover:border-[#fcdc5d]/40 transition-all"
            >
              <div>
                <div className="relative aspect-video overflow-hidden bg-[#111622]">
                  <img
                    src={p.imagem}
                    alt={p.titulo}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 text-[10px] font-bold uppercase font-mono px-2.5 py-1 rounded-md bg-[#0a0d14]/80 backdrop-blur-sm text-[#fcdc5d] border border-[#fcdc5d]/30">
                    {p.categoria}
                  </span>
                </div>

                <div className="p-6">
                  <span className="text-[11px] font-semibold text-[#94a3b8] uppercase tracking-wider block mb-1">
                    Cliente: {p.cliente}
                  </span>
                  <h3 className="text-lg font-bold font-outfit text-white mb-2.5 leading-snug">
                    {p.titulo}
                  </h3>
                  <p className="text-xs text-[#94a3b8] leading-relaxed mb-4">
                    {p.descricao}
                  </p>

                  <div className="bg-[#111622] rounded-xl p-3 border border-[#232b3e] text-xs text-emerald-400 font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{p.resultado}</span>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <Link
                  href="/atendimento"
                  className="w-full py-3 bg-[#111622] hover:bg-[#fcdc5d] text-[#94a3b8] hover:text-[#0a0d14] font-bold text-xs rounded-xl flex items-center justify-center gap-2 border border-[#232b3e] hover:border-[#fcdc5d] transition-all"
                >
                  <span>Solicitar Projeto Similar</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#232b3e] bg-[#111622] py-8 px-4 text-center text-xs text-[#94a3b8]">
        <p>© {new Date().getFullYear()} TecManutenções / Ecosistema MDK. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
