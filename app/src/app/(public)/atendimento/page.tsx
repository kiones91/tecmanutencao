import { Wrench, Camera, Mic, Send } from 'lucide-react';

export default function AtendimentoPublico() {
  return (
    <div className="min-h-screen bg-[#0a0d14] text-[#f8fafc]">
      {/* Header */}
      <header className="border-b border-[#232b3e] bg-[#111622]">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <Wrench className="h-6 w-6 text-[#fcdc5d]" />
          <div>
            <h1 className="text-xl font-bold font-outfit">TecManutenções</h1>
            <p className="text-xs text-[#94a3b8]">Atendimento Online - Faísca</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <section className="mb-8 text-center">
          <h2 className="text-2xl font-bold font-outfit mb-2">Precisa de atendimento técnico?</h2>
          <p className="text-[#94a3b8]">Descreva seu problema e nossa equipe técnica analisará seu caso</p>
        </section>

        {/* Form */}
        <div className="bg-[#161c2c] rounded-2xl p-6 border border-[#232b3e]">
          <form className="space-y-6">
            {/* Nome */}
            <div>
              <label className="block text-sm text-[#94a3b8] mb-2">Nome completo</label>
              <input 
                type="text" 
                placeholder="Seu nome"
                className="w-full bg-[#111622] border border-[#232b3e] rounded-xl px-4 py-3 text-[#f8fafc] focus:outline-none focus:border-[#fcdc5d]"
              />
            </div>

            /* WhatsApp */
            <div>
              <label className="block text-sm text-[#94a3b8] mb-2">WhatsApp</label>
              <input 
                type="tel" 
                placeholder="(XX) XXXXX-XXXX"
                className="w-full bg-[#111622] border border-[#232b3e] rounded-xl px-4 py-3 text-[#f8fafc] focus:outline-none focus:border-[#fcdc5d]"
              />
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-sm text-[#94a3b8] mb-2">Descreva o problema</label>
              <textarea 
                rows={4}
                placeholder="Conte o que está acontecendo com seu equipamento..."
                className="w-full bg-[#111622] border border-[#232b3e] rounded-xl px-4 py-3 text-[#f8fafc] focus:outline-none focus:border-[#fcdc5d] resize-none"
              />
            </div>

            {/* Upload de Mídias */}
            <div>
              <label className="block text-sm text-[#94a3b8] mb-2">Adicione fotos ou vídeos (opcional)</label>
              <div className="grid grid-cols-3 gap-3">
                <button 
                  type="button"
                  className="aspect-square bg-[#111622] border border-dashed border-[#232b3e] rounded-xl flex flex-col items-center justify-center gap-2 hover:border-[#fcdc5d] transition-colors"
                >
                  <Camera className="h-6 w-6 text-[#94a3b8]" />
                  <span className="text-xs text-[#94a3b8]">Foto</span>
                </button>
                <button 
                  type="button"
                  className="aspect-square bg-[#111622] border border-dashed border-[#232b3e] rounded-xl flex flex-col items-center justify-center gap-2 hover:border-[#fcdc5d] transition-colors"
                >
                  <Camera className="h-6 w-6 text-[#94a3b8]" />
                  <span className="text-xs text-[#94a3b8]">Foto</span>
                </button>
                <button 
                  type="button"
                  className="aspect-square bg-[#111622] border border-dashed border-[#232b3e] rounded-xl flex flex-col items-center justify-center gap-2 hover:border-[#fcdc5d] transition-colors"
                >
                  <Mic className="h-6 w-6 text-[#94a3b8]" />
                  <span className="text-xs text-[#94a3b8]">Áudio</span>
                </button>
              </div>
              <p className="text-xs text-[#94a3b8] mt-2">Máximo 3 mídias • Vídeo até 20MB • Áudio até 5min</p>
            </div>

            {/* Consentimento LGPD */}
            <div className="flex items-start gap-3 pt-4 border-t border-[#232b3e]">
              <input 
                type="checkbox" 
                id="lgpd"
                className="mt-1 w-4 h-4 rounded border-[#232b3e] bg-[#111622] text-[#fcdc5d] focus:ring-[#fcdc5d]"
              />
              <label htmlFor="lgpd" className="text-sm text-[#94a3b8]">
                Concordo com o processamento dos meus dados para fins de orçamento e atendimento técnico. 
                Seus dados serão retidos por 5 anos conforme LGPD.
              </label>
            </div>

            {/* Submit */}
            <button 
              type="submit"
              className="w-full bg-[#fcdc5d] hover:bg-[#f5cb3c] text-[#0a0d14] font-semibold py-4 px-6 rounded-xl transition-all drop-shadow-[0_0_15px_rgba(252,220,93,0.3)] flex items-center justify-center gap-2"
            >
              <Send className="h-5 w-5" />
              Enviar Solicitação
            </button>

            <p className="text-xs text-center text-[#94a3b8]">
              Nossa equipe técnica analisa e envia o orçamento no seu WhatsApp.
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}
