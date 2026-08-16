export default function Home() {
  return (
    <main className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-primary mb-4">
          TecManutenções ERP
        </h1>
        <p className="text-secondary text-lg mb-8">
          Sistema de gestão para engenharia e automação industrial
        </p>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-card rounded-[16px] p-6 border border-border-subtle">
            <h2 className="text-xl font-semibold text-primary mb-2">Fundação (F1)</h2>
            <p className="text-secondary text-sm">Em andamento...</p>
          </div>
          <div className="bg-card rounded-[16px] p-6 border border-border-subtle opacity-50">
            <h2 className="text-xl font-semibold text-primary mb-2">Captação (F2)</h2>
            <p className="text-secondary text-sm">Pendente</p>
          </div>
          <div className="bg-card rounded-[16px] p-6 border border-border-subtle opacity-50">
            <h2 className="text-xl font-semibold text-primary mb-2">Precificação (F3)</h2>
            <p className="text-secondary text-sm">Pendente</p>
          </div>
        </div>
      </div>
    </main>
  );
}
