import { requireAdmin } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function AdminDashboardPage() {
  const auth = await requireAdmin();
  
  if (auth.redirect) {
    redirect('/atendimento/login');
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border-subtle bg-surface">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-primary">Painel Administrativo</h1>
          <p className="text-secondary">TecManutenções ERP</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Cards de resumo */}
          <div className="bg-card-elevated rounded-lg p-6 border border-border-subtle">
            <h3 className="text-secondary text-sm font-medium">Orçamentos Pendentes</h3>
            <p className="text-3xl font-bold text-primary mt-2">--</p>
          </div>
          
          <div className="bg-card-elevated rounded-lg p-6 border border-border-subtle">
            <h3 className="text-secondary text-sm font-medium">OS em Execução</h3>
            <p className="text-3xl font-bold text-primary mt-2">--</p>
          </div>
          
          <div className="bg-card-elevated rounded-lg p-6 border border-border-subtle">
            <h3 className="text-secondary text-sm font-medium">Faturamento Mês</h3>
            <p className="text-3xl font-bold text-primary mt-2">R$ --</p>
          </div>
          
          <div className="bg-card-elevated rounded-lg p-6 border border-border-subtle">
            <h3 className="text-secondary text-sm font-medium">Margem Média</h3>
            <p className="text-3xl font-bold text-primary mt-2">--%</p>
          </div>
        </div>

        {/* Módulos */}
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <ModuleCard 
            title="CRM" 
            description="Gestão de leads e clientes"
            href="/admin/crm"
          />
          <ModuleCard 
            title="Orçamentos" 
            description="Motor de precificação e propostas"
            href="/admin/orcamentos"
          />
          <ModuleCard 
            title="Ordens de Serviço" 
            description="Acompanhamento de campo"
            href="/admin/os"
          />
          <ModuleCard 
            title="Financeiro" 
            description="Contas a receber/pagar e DRE"
            href="/admin/financeiro"
          />
          <ModuleCard 
            title="Fiscal" 
            description="Emissão de notas fiscais"
            href="/admin/fiscal"
          />
          <ModuleCard 
            title="Configurações" 
            description="Parâmetros, recursos, taxas"
            href="/admin/config"
          />
        </div>
      </main>
    </div>
  );
}

interface ModuleCardProps {
  title: string;
  description: string;
  href: string;
}

function ModuleCard({ title, description, href }: ModuleCardProps) {
  return (
    <a 
      href={href}
      className="bg-card-elevated rounded-lg p-6 border border-border-subtle hover:border-primary transition-colors group"
    >
      <h3 className="text-primary font-semibold group-hover:text-primary-brand transition-colors">{title}</h3>
      <p className="text-secondary text-sm mt-1">{description}</p>
    </a>
  );
}
