import { Wrench, Wifi, WifiOff, MapPin, Camera, Signature, Clock } from 'lucide-react';

export default function CampoPWA() {
  return (
    <div className="min-h-screen bg-[#0a0d14] text-[#f8fafc]">
      {/* Header com status offline/online */}
      <header className="border-b border-[#232b3e] bg-[#111622] sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Wrench className="h-6 w-6 text-[#fcdc5d]" />
            <div>
              <h1 className="text-lg font-bold font-outfit">Campo</h1>
              <p className="text-xs text-[#94a3b8]">OS #5678 — Manutenção Predial</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#161c2c] rounded-full border border-[#232b3e]">
              <WifiOff className="h-4 w-4 text-yellow-400" />
              <span className="text-xs text-[#94a3b8]">Offline</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-4 space-y-4">
        {/* Info da OS */}
        <section className="bg-[#161c2c] rounded-2xl p-4 border border-[#232b3e]">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h2 className="font-bold font-outfit">Cliente: Empresa XYZ</h2>
              <p className="text-sm text-[#94a3b8]">São Paulo - SP</p>
            </div>
            <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">Em Execução</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-[#94a3b8]">
            <MapPin className="h-4 w-4" />
            <span>Rua Industrial, 1234 - Galpão 3</span>
          </div>
        </section>

        {/* Check-in/out */}
        <section className="bg-[#161c2c] rounded-2xl p-4 border border-[#232b3e]">
          <h3 className="font-semibold mb-3">Registro de Tempo</h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 rounded-xl py-3 px-4 transition-colors">
              <Clock className="h-5 w-5 mx-auto mb-1" />
              <span className="text-sm font-medium">Check-in</span>
            </button>
            <button className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-xl py-3 px-4 transition-colors">
              <Clock className="h-5 w-5 mx-auto mb-1" />
              <span className="text-sm font-medium">Check-out</span>
            </button>
          </div>
          <p className="text-xs text-[#94a3b8] mt-3 text-center">Geo-localização automática no registro</p>
        </section>

        {/* Fotos Antes/Depois */}
        <section className="bg-[#161c2c] rounded-2xl p-4 border border-[#232b3e]">
          <h3 className="font-semibold mb-3">Registro Fotográfico</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-[#94a3b8] mb-2">Antes</label>
              <button className="w-full bg-[#111622] border border-dashed border-[#232b3e] rounded-xl py-8 flex flex-col items-center justify-center gap-2 hover:border-[#fcdc5d] transition-colors">
                <Camera className="h-8 w-8 text-[#94a3b8]" />
                <span className="text-sm text-[#94a3b8]">Adicionar foto</span>
              </button>
            </div>
            <div>
              <label className="block text-sm text-[#94a3b8] mb-2">Depois</label>
              <button className="w-full bg-[#111622] border border-dashed border-[#232b3e] rounded-xl py-8 flex flex-col items-center justify-center gap-2 hover:border-[#fcdc5d] transition-colors">
                <Camera className="h-8 w-8 text-[#94a3b8]" />
                <span className="text-sm text-[#94a3b8]">Adicionar foto</span>
              </button>
            </div>
          </div>
          <p className="text-xs text-[#94a3b8] mt-3">Marca d'água automática com data/hora/OS</p>
        </section>

        {/* Apontamento de Horas */}
        <section className="bg-[#161c2c] rounded-2xl p-4 border border-[#232b3e]">
          <h3 className="font-semibold mb-3">Apontamento de Horas</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-[#94a3b8] mb-2">Atividade</label>
              <select className="w-full bg-[#111622] border border-[#232b3e] rounded-xl px-4 py-3 text-[#f8fafc] focus:outline-none focus:border-[#fcdc5d]">
                <option>Manutenção preventiva</option>
                <option>Reparo corretivo</option>
                <option>Instalação</option>
                <option>Diagnóstico</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-[#94a3b8] mb-2">Início</label>
                <input 
                  type="time" 
                  className="w-full bg-[#111622] border border-[#232b3e] rounded-xl px-4 py-3 text-[#f8fafc] focus:outline-none focus:border-[#fcdc5d]"
                />
              </div>
              <div>
                <label className="block text-sm text-[#94a3b8] mb-2">Fim</label>
                <input 
                  type="time" 
                  className="w-full bg-[#111622] border border-[#232b3e] rounded-xl px-4 py-3 text-[#f8fafc] focus:outline-none focus:border-[#fcdc5d]"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-[#94a3b8] mb-2">Adicionais</label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" className="rounded border-[#232b3e] bg-[#111622] text-[#fcdc5d]" />
                  <span>Noturno (22h-05h) +50%</span>
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" className="rounded border-[#232b3e] bg-[#111622] text-[#fcdc5d]" />
                  <span>Altura (NR-35) +R$ 80/dia</span>
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" className="rounded border-[#232b3e] bg-[#111622] text-[#fcdc5d]" />
                  <span>Espaço Confinado (NR-33) +R$ 80/dia</span>
                </label>
              </div>
            </div>
            <button className="w-full bg-[#232b3e] hover:bg-[#2d3648] text-[#f8fafc] font-medium py-3 rounded-xl transition-colors">
              Salvar Apontamento
            </button>
            <p className="text-xs text-center text-[#94a3b8]">Salvo localmente • Sincroniza quando online</p>
          </div>
        </section>

        {/* Retirada de Insumos */}
        <section className="bg-[#161c2c] rounded-2xl p-4 border border-[#232b3e]">
          <h3 className="font-semibold mb-3">Retirada de Insumos</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-[#111622] rounded-xl">
              <div>
                <p className="font-medium text-sm">Disjuntor 50A</p>
                <p className="text-xs text-[#94a3b8]">Estoque: 12 un</p>
              </div>
              <button className="text-[#fcdc5d] text-sm font-medium">+ Retirar</button>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#111622] rounded-xl">
              <div>
                <p className="font-medium text-sm">Cabo 10mm</p>
                <p className="text-xs text-[#94a3b8]">Estoque: 50 m</p>
              </div>
              <button className="text-[#fcdc5d] text-sm font-medium">+ Retirar</button>
            </div>
          </div>
        </section>

        {/* Assinatura */}
        <section className="bg-[#161c2c] rounded-2xl p-4 border border-[#232b3e]">
          <h3 className="font-semibold mb-3">Assinatura do Cliente</h3>
          <div className="bg-[#111622] border border-[#232b3e] rounded-xl h-40 flex items-center justify-center">
            <div className="text-center">
              <Signature className="h-10 w-10 text-[#94a3b8] mx-auto mb-2" />
              <p className="text-sm text-[#94a3b8]">Toque para assinar</p>
            </div>
          </div>
          <p className="text-xs text-[#94a3b8] mt-3 text-center">Assinatura offline • Hash SHA-256 para integridade</p>
        </section>

        {/* Fila de Sync */}
        <section className="bg-[#161c2c] rounded-2xl p-4 border border-[#232b3e]">
          <h3 className="font-semibold mb-3">Fila de Sincronização</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#94a3b8]">Apontamentos pendentes</span>
              <span className="text-yellow-400">3</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#94a3b8]">Fotos para upload</span>
              <span className="text-yellow-400">2</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#94a3b8]">Último sync</span>
              <span className="text-[#94a3b8]">Há 2 horas</span>
            </div>
          </div>
          <button className="w-full mt-4 bg-[#fcdc5d] hover:bg-[#f5cb3c] text-[#0a0d14] font-semibold py-3 rounded-xl transition-all drop-shadow-[0_0_15px_rgba(252,220,93,0.3)]">
            Sincronizar Agora
          </button>
        </section>
      </main>
    </div>
  );
}
