import Link from 'next/link';
import { Wrench, Shield } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border-subtle bg-surface/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Wrench className="w-8 h-8 text-primary" />
            <h1 className="text-xl font-bold text-primary font-outfit">
              TecManutenções
            </h1>
          </div>
          <nav className="flex items-center gap-4">
            <Link
              href="/atendimento"
              className="text-secondary hover:text-primary transition-colors text-sm font-medium"
            >
              Atendimento
            </Link>
            <Link
              href="/admin"
              className="text-secondary hover:text-primary transition-colors text-sm font-medium"
            >
              Área do Sócio
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo/Icon */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
              <Wrench className="w-24 h-24 text-primary relative z-10" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-6xl font-bold text-primary font-outfit mb-6">
            Engenharia e Automação
            <br />
            <span className="text-primary">Industrial</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-secondary mb-12 max-w-2xl mx-auto">
            Soluções completas em manutenção industrial, automação e adequação NR-12 
            com precisão técnica e compromisso com sua produção.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/atendimento"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary hover:bg-primary/90 text-background font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-primary/30 min-h-[56px]"
            >
              <Shield className="w-5 h-5" />
              Atendimento imediato
              <svg 
                className="w-4 h-4 group-hover:translate-x-1 transition-transform" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            
            <Link
              href="/admin"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-surface hover:bg-card border border-border-subtle text-primary font-semibold rounded-lg transition-all duration-200 min-h-[56px]"
            >
              <Wrench className="w-5 h-5" />
              Área do sócio
              <svg 
                className="w-4 h-4 group-hover:translate-x-1 transition-transform" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="bg-card/50 rounded-lg p-4 border border-border-subtle">
              <p className="text-2xl font-bold text-primary font-outfit">NR-12</p>
              <p className="text-xs text-secondary mt-1">Adequação Turnkey</p>
            </div>
            <div className="bg-card/50 rounded-lg p-4 border border-border-subtle">
              <p className="text-2xl font-bold text-primary font-outfit">24/7</p>
              <p className="text-xs text-secondary mt-1">Paradas Programadas</p>
            </div>
            <div className="bg-card/50 rounded-lg p-4 border border-border-subtle">
              <p className="text-2xl font-bold text-primary font-outfit">Retrofit</p>
              <p className="text-xs text-secondary mt-1">Automação Industrial</p>
            </div>
            <div className="bg-card/50 rounded-lg p-4 border border-border-subtle">
              <p className="text-2xl font-bold text-primary font-outfit">90d</p>
              <p className="text-xs text-secondary mt-1">Garantia Certificada</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border-subtle bg-surface/30">
        <div className="max-w-6xl mx-auto px-6 py-6 text-center">
          <p className="text-secondary text-sm">
            © {new Date().getFullYear()} TecManutenções Engenharia e Automação Industrial
          </p>
        </div>
      </footer>
    </main>
  );
}
