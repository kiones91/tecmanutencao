'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Users, FileText, Wrench, Settings, LogOut, ArrowRight, 
  Activity, ShieldCheck, Sparkles, RefreshCw, HardHat
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    leadsNovos: 0,
    leadsTotal: 0,
    clientesTotal: 0,
    orcamentosTotal: 0,
  });
  const [carregando, setCarregando] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    async function carregarMetricas() {
      setCarregando(true);
      try {
        // Usuário logado
        const { data: { user } } = await supabase.auth.getUser();
        if (user) setUserEmail(user.email || 'Admin');

        // Contagens do Supabase
        const [{ count: leadsNovosCount }, { count: leadsTotalCount }, { count: clientesCount }, { count: orcamentosCount }] = await Promise.all([
          supabase.from('leads').select('*', { count: 'exact', head: true }).eq('status', 'novo'),
          supabase.from('leads').select('*', { count: 'exact', head: true }),
          supabase.from('clientes').select('*', { count: 'exact', head: true }),
          supabase.from('orcamentos').select('*', { count: 'exact', head: true }),
        ]);

        setStats({
          leadsNovos: leadsNovosCount || 0,
          leadsTotal: leadsTotalCount || 0,
          clientesTotal: clientesCount || 0,
          orcamentosTotal: orcamentosCount || 0,
        });
      } catch (err) {
        console.error('Erro ao carregar métricas:', err);
      } finally {
        setCarregando(false);
      }
    }

    carregarMetricas();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#0a0d14] text-[#f8fafc]">
      {/* Header */}
      <header className="border-b border-[#232b3e] bg-[#111622] sticky top-0 z-30">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#fcdc5d]/10 border border-[#fcdc5d]/30 flex items-center justify-center">
              <Wrench className="h-5 w-5 text-[#fcdc5d]" />
            </div>
            <div>
              <h1 className="text-lg font-bold font-outfit text-white">TecManutenções ERP</h1>
              <p className="text-xs text-[#94a3b8]">Gestão Industrial & Operacional MDK</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-medium">
            <Link href="/admin" className="text-[#fcdc5d] font-bold">Painel</Link>
            <Link href="/admin/leads" className="text-[#94a3b8] hover:text-white transition-colors">Leads CRM</Link>
            <Link href="/admin/orcamentos" className="text-[#94a3b8] hover:text-white transition-colors">Orçamentos</Link>
            <Link href="/campo" className="text-[#94a3b8] hover:text-white transition-colors">Modo Campo</Link>
            <Link href="/admin/config" className="text-[#94a3b8] hover:text-white transition-colors">Configurações</Link>
          </nav>

          <div className="flex items-center gap-3">
            {userEmail && (
              <span className="hidden sm:inline-block text-xs font-mono text-[#94a3b8] bg-[#161c2c] px-2.5 py-1 rounded-lg border border-[#232b3e]">
                {userEmail}
              </span>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs font-semibold text-red-400 hover:text-red-300 border border-red-900/40 hover:border-red-800 bg-red-950/20 px-3 py-1.5 rounded-xl transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Welcome */}
        <section className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold font-outfit text-white mb-1">
              Painel de Operações
            </h2>
            <p className="text-sm text-[#94a3b8]">
              Visão consolidada de triagem, clientes, orçamentos e serviços em tempo real.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/atendimento"
              target="_blank"
              className="flex items-center gap-2 text-xs font-bold text-[#0a0d14] bg-[#fcdc5d] hover:bg-[#f5cb3c] px-4 py-2.5 rounded-xl transition-all shadow-md shadow-[#fcdc5d]/10"
            >
              <Sparkles className="w-4 h-4" />
              <span>Abrir Formulário Faísca</span>
            </Link>
          </div>
        </section>

        {/* Real KPI Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {/* Card 1: Leads Novos */}
          <Link
            href="/admin/leads"
            className="bg-[#161c2c] hover:bg-[#1b2235] rounded-2xl p-6 border border-[#232b3e] hover:border-[#fcdc5d]/40 transition-all shadow-lg group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#94a3b8]">Leads Novos</span>
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-bold font-outfit text-white">
              {carregando ? '...' : stats.leadsNovos}
            </p>
            <p className="text-xs text-blue-400 mt-2 flex items-center gap-1">
              <span>{stats.leadsTotal} no total acumulado</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </p>
          </Link>

          {/* Card 2: Clientes Cadastrados */}
          <div className="bg-[#161c2c] rounded-2xl p-6 border border-[#232b3e] shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#94a3b8]">Clientes na Base</span>
              <div className="w-8 h-8 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-bold font-outfit text-white">
              {carregando ? '...' : stats.clientesTotal}
            </p>
            <p className="text-xs text-[#94a3b8] mt-2">Contratos e prospecções</p>
          </div>

          {/* Card 3: Orçamentos */}
          <Link
            href="/admin/orcamentos"
            className="bg-[#161c2c] hover:bg-[#1b2235] rounded-2xl p-6 border border-[#232b3e] hover:border-[#fcdc5d]/40 transition-all shadow-lg group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#94a3b8]">Orçamentos</span>
              <div className="w-8 h-8 rounded-xl bg-[#fcdc5d]/10 border border-[#fcdc5d]/20 flex items-center justify-center text-[#fcdc5d] group-hover:scale-110 transition-transform">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-bold font-outfit text-white">
              {carregando ? '...' : stats.orcamentosTotal}
            </p>
            <p className="text-xs text-[#fcdc5d] mt-2 flex items-center gap-1">
              <span>Composer e precificação</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </p>
          </Link>

          {/* Card 4: Operação / Campo */}
          <Link
            href="/campo"
            className="bg-[#161c2c] hover:bg-[#1b2235] rounded-2xl p-6 border border-[#232b3e] hover:border-[#fcdc5d]/40 transition-all shadow-lg group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#94a3b8]">Área de Campo</span>
              <div className="w-8 h-8 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 group-hover:scale-110 transition-transform">
                <HardHat className="w-4 h-4" />
              </div>
            </div>
            <p className="text-base font-bold font-outfit text-white mt-1">
              PWA Offline
            </p>
            <p className="text-xs text-orange-400 mt-2 flex items-center gap-1">
              <span>Acessar ordens de serviço</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </p>
          </Link>
        </section>

        {/* Quick Hub Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#161c2c] rounded-2xl p-6 border border-[#232b3e]">
            <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-[#fcdc5d]" />
              <span>CRM & Triagem de Leads</span>
            </h3>
            <p className="text-xs text-[#94a3b8] leading-relaxed mb-4">
              Acompanhe os chamados abertos pelo formulário público, filtre por urgência e qualifique os contatos diretamente.
            </p>
            <Link
              href="/admin/leads"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#fcdc5d] hover:underline"
            >
              <span>Gerenciar Leads</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-[#161c2c] rounded-2xl p-6 border border-[#232b3e]">
            <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#fcdc5d]" />
              <span>Motor de Precificação</span>
            </h3>
            <p className="text-xs text-[#94a3b8] leading-relaxed mb-4">
              Elabore orçamentos baseados em Markup Divisor, BDI, taxas por linha de serviço (NR12, Automação, Paradas) e 3 cenários.
            </p>
            <Link
              href="/admin/orcamentos"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#fcdc5d] hover:underline"
            >
              <span>Abrir Orçamentos</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-[#161c2c] rounded-2xl p-6 border border-[#232b3e]">
            <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
              <Settings className="w-4 h-4 text-[#fcdc5d]" />
              <span>Parâmetros & Taxas</span>
            </h3>
            <p className="text-xs text-[#94a3b8] leading-relaxed mb-4">
              Ajuste as taxas de homem-hora (HH), adicionais de periculosidade/noturno, alimentação, km rodado e custos fixos.
            </p>
            <Link
              href="/admin/config"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#fcdc5d] hover:underline"
            >
              <span>Configurar Parâmetros</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
