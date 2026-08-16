export default function CampoPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border-subtle bg-surface">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary">Campo</h1>
              <p className="text-secondary">PWA do Técnico (Offline-first)</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-xs text-secondary">Online</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* TODO-F1: Implementar PWA field com IndexedDB e sync */}
        <div className="space-y-6">
          <div className="bg-card-elevated rounded-lg p-6 border border-border-subtle">
            <h2 className="text-xl font-semibold text-primary mb-4">Minhas OS</h2>
            <p className="text-secondary text-sm mb-4">Ordens de serviço atribuídas</p>
            
            <div className="space-y-3">
              {/* Placeholder de OS */}
              <div className="bg-surface rounded p-4 border border-border-subtle">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-primary-brand font-mono text-xs">#OS ----</span>
                    <p className="text-primary font-medium mt-1">--</p>
                    <p className="text-secondary text-xs mt-1">Cliente: --</p>
                  </div>
                  <span className="text-xs bg-surface border border-border-subtle px-2 py-1 rounded text-secondary">
                    --
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card-elevated rounded-lg p-6 border border-border-subtle">
            <h2 className="text-xl font-semibold text-primary mb-4">Funcionalidades (F4)</h2>
            <ul className="space-y-2 text-secondary text-sm">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                Check-in/out com geo
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                Fotos antes/depois com marca d'água
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                Apontamento de horas + adicionais
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                Retirada de insumos
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                Assinatura touch offline
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                Sync automático quando online
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
