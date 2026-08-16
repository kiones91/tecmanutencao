export default function AtendimentoPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border-subtle bg-surface">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-primary">Atendimento</h1>
          <p className="text-secondary">Captação de leads via IA (Faísca)</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-card-elevated rounded-lg p-6 border border-border-subtle">
            <h2 className="text-xl font-semibold text-primary mb-4">Nova Solicitação</h2>
            <p className="text-secondary text-sm mb-6">
              Descreva sua necessidade técnica. Nossa IA irá analisar e encaminhar para a equipe.
            </p>
            
            {/* TODO-F1: Implementar formulário de captação com upload de mídias */}
            <div className="space-y-4">
              <div>
                <label className="block text-secondary text-sm mb-2">Nome</label>
                <input 
                  type="text" 
                  className="w-full bg-surface border border-border-subtle rounded px-3 py-2 text-primary focus:outline-none focus:border-primary"
                  placeholder="Seu nome"
                />
              </div>
              
              <div>
                <label className="block text-secondary text-sm mb-2">WhatsApp</label>
                <input 
                  type="tel" 
                  className="w-full bg-surface border border-border-subtle rounded px-3 py-2 text-primary focus:outline-none focus:border-primary"
                  placeholder="(00) 00000-0000"
                />
              </div>
              
              <div>
                <label className="block text-secondary text-sm mb-2">Mensagem ou Áudio</label>
                <textarea 
                  className="w-full bg-surface border border-border-subtle rounded px-3 py-2 text-primary focus:outline-none focus:border-primary min-h-[120px]"
                  placeholder="Descreva o problema ou necessidade..."
                />
              </div>
              
              <div>
                <label className="block text-secondary text-sm mb-2">Anexos (fotos/vídeos)</label>
                <div className="border-2 border-dashed border-border-subtle rounded p-6 text-center">
                  <p className="text-secondary text-sm">Arraste arquivos ou clique para selecionar</p>
                  <p className="text-secondary text-xs mt-1">Máximo 3 arquivos, vídeo até 20MB</p>
                </div>
              </div>
              
              <button className="w-full bg-primary hover:bg-primary-hover text-background font-semibold py-3 rounded transition-colors">
                Enviar Solicitação
              </button>
            </div>
          </div>
          
          <p className="text-secondary text-xs mt-4 text-center">
            Ao enviar, você concorda com nossos termos de uso e política de privacidade.
            Os dados serão tratados conforme LGPD.
          </p>
        </div>
      </main>
    </div>
  );
}
