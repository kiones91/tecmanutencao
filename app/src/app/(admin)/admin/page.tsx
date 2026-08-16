import Link from 'next/link';
import { Settings, Users, FileText, Wrench, TrendingUp, Menu } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-[#0a0d14] text-[#f8fafc]">
      {/* Header */}
      <header className="border-b border-[#232b3e] bg-[#111622]">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Wrench className="h-6 w-6 text-[#fcdc5d]" />
            <div>
              <h1 className="text-xl font-bold font-outfit">TecManutenções</h1>
              <p className="text-xs text-[#94a3b8]">Painel Administrativo</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/admin" className="text-[#fcdc5d] font-medium">Dashboard</Link>
            <Link href="/admin/crm" className="text-[#94a3b8] hover:text-[#f8fafc] transition-colors">CRM</Link>
            <Link href="/admin/orcamentos" className="text-[#94a3b8] hover:text-[#f8fafc] transition-colors">Orçamentos</Link>
            <Link href="/admin/os" className="text-[#94a3b8] hover:text-[#f8fafc] transition-colors">Ordens de Serviço</Link>
            <Link href="/admin/financeiro" className="text-[#94a3b8] hover:text-[#f8fafc] transition-colors">Financeiro</Link>
            <Link href="/admin/config" className="text-[#94a3b8] hover:text-[#f8fafc] transition-colors">Configurações</Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold font-outfit mb-2">Bem-vindo ao ERP</h2>
          <p className="text-[#94a3b8]">Visão geral da TecManutenções Engenharia e Automação Industrial</p>
        </section>

        {/* KPI Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#161c2c] rounded-2xl p-6 border border-[#232b3e]">
            <div className="flex items-center justify-between mb-4">
              <Users className="h-8 w-8 text-[#fcdc5d]" />
              <TrendingUp className="h-5 w-5 text-green-400" />
            </div>
            <p className="text-[#94a3b8] text-sm mb-1">Leads Ativos</p>
            <p className="text-3xl font-bold font-outfit">12</p>
            <p className="text-xs text-green-400 mt-2">+3 essa semana</p>
          </div>

          <div className="bg-[#161c2c] rounded-2xl p-6 border border-[#232b3e]">
            <div className="flex items-center justify-between mb-4">
              <FileText className="h-8 w-8 text-[#fcdc5d]" />
              <TrendingUp className="h-5 w-5 text-green-400" />
            </div>
            <p className="text-[#94a3b8] text-sm mb-1">Orçamentos Pendentes</p>
            <p className="text-3xl font-bold font-outfit">7</p>
            <p className="text-xs text-[#94a3b8] mt-2">R$ 184.500 em valor</p>
          </div>

          <div className="bg-[#161c2c] rounded-2xl p-6 border border-[#232b3e]">
            <div className="flex items-center justify-between mb-4">
              <Wrench className="h-8 w-8 text-[#fcdc5d]" />
              <TrendingUp className="h-5 w-5 text-yellow-400" />
            </div>
            <p className="text-[#94a3b8] text-sm mb-1">OS em Execução</p>
            <p className="text-3xl font-bold font-outfit">4</p>
            <p className="text-xs text-yellow-400 mt-2">2 atrasadas</p>
          </div>

          <div className="bg-[#161c2c] rounded-2xl p-6 border border-[#232b3e]">
            <div className="flex items-center justify-between mb-4">
              <Settings className="h-8 w-8 text-[#fcdc5d]" />
              <TrendingUp className="h-5 w-5 text-green-400" />
            </div>
            <p className="text-[#94a3b8] text-sm mb-1">Margem Média</p>
            <p className="text-3xl font-bold font-outfit">22.4%</p>
            <p className="text-xs text-green-400 mt-2">+1.2% vs mês anterior</p>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#161c2c] rounded-2xl p-6 border border-[#232b3e]">
            <h3 className="text-lg font-bold font-outfit mb-4">Ações Rápidas</h3>
            <div className="space-y-3">
              <Link 
                href="/admin/orcamentos/novo"
                className="block w-full bg-[#fcdc5d] hover:bg-[#f5cb3c] text-[#0a0d14] font-semibold py-3 px-4 rounded-xl transition-all drop-shadow-[0_0_15px_rgba(252,220,93,0.3)] text-center"
              >
                Novo Orçamento
              </Link>
              <Link 
                href="/admin/os/nova"
                className="block w-full bg-[#232b3e] hover:bg-[#2d3648] text-[#f8fafc] font-semibold py-3 px-4 rounded-xl transition-all text-center"
              >
                Criar Ordem de Serviço
              </Link>
              <Link 
                href="/admin/crm/novo"
                className="block w-full bg-[#232b3e] hover:bg-[#2d3648] text-[#f8fafc] font-semibold py-3 px-4 rounded-xl transition-all text-center"
              >
                Adicionar Cliente
              </Link>
            </div>
          </div>

          <div className="bg-[#161c2c] rounded-2xl p-6 border border-[#232b3e]">
            <h3 className="text-lg font-bold font-outfit mb-4">Últimas Atividades</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3 pb-3 border-b border-[#232b3e]">
                <div className="w-2 h-2 rounded-full bg-[#fcdc5d] mt-1.5"></div>
                <div>
                  <p className="text-[#f8fafc]">Orçamento #1234 aprovado internamente</p>
                  <p className="text-[#94a3b8] text-xs">Há 2 horas por Kiones</p>
                </div>
              </div>
              <div className="flex items-start gap-3 pb-3 border-b border-[#232b3e]">
                <div className="w-2 h-2 rounded-full bg-green-400 mt-1.5"></div>
                <div>
                  <p className="text-[#f8fafc]">OS #5678 concluída e assinada</p>
                  <p className="text-[#94a3b8] text-xs">Há 4 horas por Dioleno</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-400 mt-1.5"></div>
                <div>
                  <p className="text-[#f8fafc]">Novo lead via Faísca (WhatsApp)</p>
                  <p className="text-[#94a3b8] text-xs">Há 6 horas</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
