import { requireAdmin } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function ConfigPage() {
  const auth = await requireAdmin();
  
  if (auth.redirect) {
    redirect('/atendimento/login');
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border-subtle bg-surface">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <a href="/admin" className="text-secondary hover:text-primary transition-colors">← Voltar</a>
            <h1 className="text-2xl font-bold text-primary">Configurações</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Parâmetros Financeiros */}
          <section className="bg-card-elevated rounded-lg p-6 border border-border-subtle">
            <h2 className="text-xl font-semibold text-primary mb-4">Parâmetros Financeiros</h2>
            <p className="text-secondary text-sm mb-6">Valores seed conforme especificação do negócio</p>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <ParamField 
                label="Margem Padrão (%)" 
                value="20" 
                description="Margem de lucro padrão para cálculos"
              />
              <ParamField 
                label="Imposto Anexo III (%)" 
                value="6" 
                description="Manutenção/instalação"
              />
              <ParamField 
                label="Imposto Anexo V (%)" 
                value="15.5" 
                description="Engenharia/projetos (sem Fator R)"
              />
              <ParamField 
                label="Fator R" 
                value="Ativo" 
                description="Se folha ≥ 28% do faturamento, Anexo V cai para 6%"
              />
              <ParamField 
                label="Markup Material Min (%)" 
                value="20" 
                description="Mínimo para materiais"
              />
              <ParamField 
                label="Markup Material Max (%)" 
                value="30" 
                description="Máximo para materiais"
              />
              <ParamField 
                label="Custo Fixo Mensal (R$)" 
                value="9.000 - 13.000" 
                description="Faixa para cálculo do BDI"
              />
              <ParamField 
                label="Horas Úteis/Mês" 
                value="320" 
                description="Base para rateio do BDI"
              />
              <ParamField 
                label="Km Rodado (R$/km)" 
                value="1.80 - 2.50" 
                description="Faixa de reembolso"
              />
              <ParamField 
                label="Alimentação/Dia (R$)" 
                value="70" 
                description="Por pessoa"
              />
              <ParamField 
                label="Saída Mínima Predial (R$)" 
                value="50" 
                description="Quando km = 0"
              />
              <ParamField 
                label="Garantia (dias)" 
                value="90" 
                description="Termo de garantia padrão"
              />
              <ParamField 
                label="ART Padrão (R$)" 
                value="120" 
                description="Valor por ART"
              />
            </div>
          </section>

          {/* Linhas de Serviço */}
          <section className="bg-card-elevated rounded-lg p-6 border border-border-subtle">
            <h2 className="text-xl font-semibold text-primary mb-4">Linhas de Serviço</h2>
            <div className="space-y-3">
              <ServiceLine code="NR12" name="NR12 Turnkey" anexo="III" faixa="R$ 27.900–32.000" />
              <ServiceLine code="AUTO" name="Automação/Retrofit" anexo="V" faixa="R$ 69.500–80.000" />
              <ServiceLine code="PARADA" name="Parada Programada" anexo="III" faixa="R$ 41.900" />
              <ServiceLine code="MANUT" name="Manutenção Preventiva" anexo="III" faixa="Contrato mensal" />
            </div>
          </section>

          {/* Recursos */}
          <section className="bg-card-elevated rounded-lg p-6 border border-border-subtle">
            <h2 className="text-xl font-semibold text-primary mb-4">Recursos</h2>
            <div className="space-y-3">
              <ResourceItem name="Kiones" tipo="Sênior Automação" venda="R$ 200–300/h" />
              <ResourceItem name="Dioleno" tipo="Técnico Pleno" venda="R$ 120–150/h" />
              <ResourceItem name="Maike" tipo="Eng. Eletricista (ART)" venda="R$ 150–200/h" />
              <ResourceItem name="Eletricista Industrial" tipo="Campo" venda="R$ 80–100/h" custo="R$ 35–50/h" />
              <ResourceItem name="Ajudante" tipo="Campo" venda="R$ 45–60/h" />
              <ResourceItem name="Freelancer" tipo="Terceiro" venda="Variável" />
            </div>
          </section>

          {/* Adicionais Industriais */}
          <section className="bg-card-elevated rounded-lg p-6 border border-border-subtle">
            <h2 className="text-xl font-semibold text-primary mb-4">Adicionais Industriais</h2>
            <div className="grid gap-3 md:grid-cols-2">
              <AdditionalItem name="Periculosidade (linha viva/AT/MT)" valor="+30%" ambito="Venda" />
              <AdditionalItem name="Noturno (22h-05h)" valor="+50%" ambito="Venda" />
              <AdditionalItem name="Parada de fábrica / fim de semana" valor="+50%" ambito="Venda" />
              <AdditionalItem name="NR-33 / NR-35 (espaço confinado / altura)" valor="+R$ 80/dia/pessoa" ambito="Custo" />
              <AdditionalItem name="Atmosfera explosiva / planta química" valor="+R$ 100/dia" ambito="Custo" />
              <AdditionalItem name="Ruído/poeira/peçonhentos" valor="+R$ 50/dia" ambito="Custo" />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

interface ParamFieldProps {
  label: string;
  value: string;
  description: string;
}

function ParamField({ label, value, description }: ParamFieldProps) {
  return (
    <div className="bg-surface rounded p-4 border border-border-subtle">
      <label className="text-secondary text-xs font-medium">{label}</label>
      <p className="text-primary font-semibold mt-1">{value}</p>
      <p className="text-secondary text-xs mt-1">{description}</p>
    </div>
  );
}

interface ServiceLineProps {
  code: string;
  name: string;
  anexo: string;
  faixa: string;
}

function ServiceLine({ code, name, anexo, faixa }: ServiceLineProps) {
  return (
    <div className="flex items-center justify-between bg-surface rounded p-3 border border-border-subtle">
      <div>
        <span className="text-primary-brand font-mono text-xs">{code}</span>
        <p className="text-primary font-medium">{name}</p>
      </div>
      <div className="text-right">
        <span className="text-secondary text-xs">Anexo {anexo}</span>
        <p className="text-primary text-sm">{faixa}</p>
      </div>
    </div>
  );
}

interface ResourceItemProps {
  name: string;
  tipo: string;
  venda: string;
  custo?: string;
}

function ResourceItem({ name, tipo, venda, custo }: ResourceItemProps) {
  return (
    <div className="flex items-center justify-between bg-surface rounded p-3 border border-border-subtle">
      <div>
        <p className="text-primary font-medium">{name}</p>
        <p className="text-secondary text-xs">{tipo}</p>
      </div>
      <div className="text-right">
        <p className="text-primary text-sm">{venda}</p>
        {custo && <p className="text-secondary text-xs">Custo: {custo}</p>}
      </div>
    </div>
  );
}

interface AdditionalItemProps {
  name: string;
  valor: string;
  ambito: string;
}

function AdditionalItem({ name, valor, ambito }: AdditionalItemProps) {
  return (
    <div className="flex items-center justify-between bg-surface rounded p-3 border border-border-subtle">
      <p className="text-primary text-sm">{name}</p>
      <div className="text-right">
        <span className="text-primary-brand font-semibold">{valor}</span>
        <span className="text-secondary text-xs ml-2">({ambito})</span>
      </div>
    </div>
  );
}
