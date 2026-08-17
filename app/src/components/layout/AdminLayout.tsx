'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Wrench,
  LayoutDashboard,
  Users,
  FileText,
  DollarSign,
  Briefcase,
  Layers,
  BarChart3,
  HardHat,
  Settings,
  LogOut,
  Sparkles,
  Menu,
  X,
  ExternalLink,
  MessageSquare,
  ShieldCheck,
  ChevronRight,
  Receipt,
  Headphones,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const NAV_LINKS = [
  { href: '/admin', label: 'Painel', icon: LayoutDashboard },
  { href: '/admin/leads', label: 'Leads CRM', icon: Users },
  { href: '/admin/orcamentos', label: 'Orçamentos', icon: FileText },
  { href: '/admin/contratos', label: 'Contratos', icon: Briefcase },
  { href: '/admin/financeiro', label: 'Financeiro & DRE', icon: DollarSign },
  { href: '/admin/suprimentos', label: 'Suprimentos', icon: Layers },
  { href: '/admin/fiscal', label: 'Fiscal & NFe', icon: Receipt },
  { href: '/admin/bi', label: 'BI & Analytics', icon: BarChart3 },
  { href: '/campo', label: 'Modo Campo', icon: HardHat },
  { href: '/admin/config', label: 'Configurações', icon: Settings },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    async function getUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) setUserEmail(user.email || 'Admin');
    }
    getUser();
  }, [supabase]);

  // Close drawer on route change
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#06080e] text-[#f8fafc] flex flex-col relative lumimotion-grid">
      {/* Top Cyber Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-[#232d42]/80 bg-[#0c1018]/90 backdrop-blur-xl transition-all">
        <div className="w-full max-w-7xl mx-auto px-3.5 sm:px-6 h-16 flex items-center justify-between gap-3">
          {/* Logo & Brand Info */}
          <div className="flex items-center gap-3">
            <Link href="/admin" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-b from-[#1c2436] to-[#0e131d] border border-[#2c3852] flex items-center justify-center shadow-[0_0_15px_rgba(252,220,93,0.12)] group-hover:border-[#fcdc5d]/50 transition-all">
                <Wrench className="h-4 w-4 sm:h-5 sm:w-5 text-[#fcdc5d]" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm sm:text-base font-extrabold font-outfit text-white tracking-tight">
                    TecManutenções
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#fcdc5d] bg-[#fcdc5d]/10 px-1.5 py-0.2 rounded border border-[#fcdc5d]/20 hidden sm:inline-block">
                    ERP
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium hidden sm:inline-block">
                  Engenharia & Automação MDK
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1 bg-[#101622]/80 border border-[#232d42]/60 px-2 py-1 rounded-xl">
            {NAV_LINKS.slice(0, 7).map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#fcdc5d] text-[#0a0d14] shadow-sm font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <item.icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#0a0d14]' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Chat Link Button */}
            <Link
              href="/atendimento"
              target="_blank"
              className="flex items-center gap-1.5 text-xs font-bold text-[#0a0d14] bg-[#fcdc5d] hover:bg-[#f5cb3c] px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl transition-all shadow-[0_4px_16px_rgba(252,220,93,0.25)] active:scale-95"
              title="Abrir Chat do Engenheiro Faísca"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Assistente Faísca</span>
              <span className="sm:hidden">Faísca</span>
            </Link>

            {/* User status badge */}
            {userEmail && (
              <span className="hidden md:inline-flex items-center gap-1.5 text-xs font-mono text-slate-300 bg-[#121824] px-2.5 py-1 rounded-lg border border-[#232d42]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="max-w-[120px] truncate">{userEmail}</span>
              </span>
            )}

            {/* Logout button (Desktop) */}
            <button
              onClick={handleLogout}
              className="hidden sm:flex items-center gap-1 text-xs font-semibold text-red-400 hover:text-red-300 border border-red-900/40 hover:border-red-800 bg-red-950/20 px-2.5 py-1.5 rounded-xl transition-all"
              title="Encerrar Sessão"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Sair</span>
            </button>

            {/* Mobile Drawer Hamburger Trigger */}
            <button
              onClick={() => setDrawerOpen(!drawerOpen)}
              className="xl:hidden p-2 rounded-xl bg-[#121824] border border-[#232d42] text-slate-300 hover:text-white hover:border-[#fcdc5d]/40 transition-all flex items-center justify-center"
              aria-label="Abrir Menu Completo"
            >
              {drawerOpen ? <X className="w-5 h-5 text-[#fcdc5d]" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8 mobile-nav-spacer">
        {children}
      </main>

      {/* Mobile Bottom Navigation Bar (Thumb Ergonomics for 90% Mobile Users) */}
      <nav className="xl:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0c1018]/95 border-t border-[#232d42] backdrop-blur-2xl shadow-[0_-10px_30px_rgba(0,0,0,0.8)] pb-[env(safe-area-inset-bottom,0px)]">
        <div className="grid grid-cols-5 h-16 items-center px-1">
          <Link
            href="/admin"
            className={`flex flex-col items-center justify-center py-1 gap-1 transition-all ${
              pathname === '/admin' ? 'text-[#fcdc5d]' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className={`p-1 rounded-lg ${pathname === '/admin' ? 'bg-[#fcdc5d]/10' : ''}`}>
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-semibold tracking-tight">Painel</span>
          </Link>

          <Link
            href="/admin/leads"
            className={`flex flex-col items-center justify-center py-1 gap-1 transition-all ${
              pathname.startsWith('/admin/leads') ? 'text-[#fcdc5d]' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className={`p-1 rounded-lg ${pathname.startsWith('/admin/leads') ? 'bg-[#fcdc5d]/10' : ''}`}>
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-semibold tracking-tight">Leads</span>
          </Link>

          <Link
            href="/admin/orcamentos"
            className={`flex flex-col items-center justify-center py-1 gap-1 transition-all ${
              pathname.startsWith('/admin/orcamentos') ? 'text-[#fcdc5d]' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className={`p-1 rounded-lg ${pathname.startsWith('/admin/orcamentos') ? 'bg-[#fcdc5d]/10' : ''}`}>
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-semibold tracking-tight">Orçamentos</span>
          </Link>

          <Link
            href="/admin/financeiro"
            className={`flex flex-col items-center justify-center py-1 gap-1 transition-all ${
              pathname.startsWith('/admin/financeiro') ? 'text-[#fcdc5d]' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className={`p-1 rounded-lg ${pathname.startsWith('/admin/financeiro') ? 'bg-[#fcdc5d]/10' : ''}`}>
              <DollarSign className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-semibold tracking-tight">Financeiro</span>
          </Link>

          <button
            onClick={() => setDrawerOpen(true)}
            className="flex flex-col items-center justify-center py-1 gap-1 text-slate-400 hover:text-slate-200 transition-all"
          >
            <div className="p-1 rounded-lg">
              <Menu className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-semibold tracking-tight">Mais</span>
          </button>
        </div>
      </nav>

      {/* Offcanvas Drawer Menu (Mobile & Tablet) */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex xl:hidden animate-in fade-in duration-200">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => setDrawerOpen(false)}
          />

          {/* Drawer content container */}
          <div className="relative ml-auto w-[85%] max-w-sm h-full bg-[#0c1018] border-l border-[#232d42] p-5 flex flex-col justify-between shadow-2xl overflow-y-auto">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#232d42]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#fcdc5d]/10 border border-[#fcdc5d]/30 flex items-center justify-center">
                    <Wrench className="h-4 w-4 text-[#fcdc5d]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold font-outfit text-white">TecManutenções ERP</h3>
                    <p className="text-[11px] text-slate-400">Menu Principal</p>
                  </div>
                </div>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="p-1.5 rounded-lg bg-[#141a28] text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Group */}
              <div className="mt-5 space-y-1.5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500 px-3 mb-2">
                  Módulos de Gestão
                </p>
                {NAV_LINKS.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-[#fcdc5d] text-[#0a0d14] font-bold shadow-md shadow-[#fcdc5d]/15'
                          : 'text-slate-300 hover:bg-[#151c2c] hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className={`w-4 h-4 ${isActive ? 'text-[#0a0d14]' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </div>
                      <ChevronRight className={`w-3.5 h-3.5 ${isActive ? 'text-[#0a0d14]' : 'text-slate-600'}`} />
                    </Link>
                  );
                })}
              </div>

              {/* Quick Customer Channels */}
              <div className="mt-6 pt-5 border-t border-[#232d42] space-y-2">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500 px-3 mb-1">
                  Atendimento & Campo
                </p>
                <Link
                  href="/atendimento"
                  target="_blank"
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-[#121927] border border-[#232d42] text-slate-200 hover:border-[#fcdc5d]/40 transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-[#fcdc5d]" />
                    <span>Chat Faísca (IA Industrial)</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                </Link>

                <a
                  href="https://wa.me/5519983808498"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-[#121927] border border-[#232d42] text-slate-200 hover:border-emerald-400/40 transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <MessageSquare className="w-4 h-4 text-emerald-400" />
                    <span>WhatsApp Plantão 24h</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                </a>
              </div>
            </div>

            {/* Drawer Footer with user and logout */}
            <div className="pt-4 border-t border-[#232d42] mt-6">
              {userEmail && (
                <div className="mb-3 px-2 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="truncate">{userEmail}</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                </div>
              )}
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-950/30 border border-red-800/40 text-red-400 text-xs font-bold hover:bg-red-900/40 transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span>Desconectar Sessão</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
