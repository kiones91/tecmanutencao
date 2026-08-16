import Link from 'next/link';
import { ArrowLeft, Settings, DollarSign, TrendingUp, Wrench, FileText } from 'lucide-react';

export default function AdminConfig() {
  return (
    <div className="min-h-screen bg-[#0a0d14] text-[#f8fafc]">
      {/* Header */}
      <header className="border-b border-[#232b3e] bg-[#111622]">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/admin" className="text-[#94a3b8] hover:text-[#f8fafc] transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex items-center gap-3">
            <Settings className="h-6 w-6 text-[#fcdc5d]" />
            <div>
              <h1 className="text-xl font-bold font-outfit">Configurações</h1>
              <p className="text-xs text-[#94a3b8]">Parâmetros do sistema</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <section className="mb-8">
          <h2 className="text-2xl font-bold font-outfit mb-2">Parâmetros Financeiros</h2>
          <p className="text-[#94a3b8]">Configure as regras de precificação e impostos</p>
        </section>

        {/* Config Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Impostos */}
          <div className="bg-[#161c2c] rounded-2xl p-6 border border-[#232b3e]">
            <div className="flex items-center gap-3 mb-4">
              <DollarSign className="h-6 w-6 text-[#fcdc5d]" />
              <h3 className="text-lg font-bold font-outfit">Impostos (Simples Nacional)</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-[#94a3b8] mb-2">Anexo III (Manutenção/Instalação)</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    defaultValue={6}
                    className="flex-1 bg-[#111622] border border-[#232b3e] rounded-xl px-4 py-3 text-[#f8fafc] focus:outline-none focus:border-[#fcdc5d]"
                  />
                  <span className="text-[#94a3b8]">%</span>
                </div>
              </div>
              <div>
                <label className="block text-sm text-[#94a3b8] mb-2">Anexo V (Engenharia/Projetos)</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    defaultValue={15.5}
                    className="flex-1 bg-[#111622] border border-[#232b3e] rounded-xl px-4 py-3 text-[#f8fafc] focus:outline-none focus:border-[#fcdc5d]"
                  />
                  <span className="text-[#94a3b8]">%</span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-[#232b3e]">
                <div>
                  <p className="font-medium">Fator R Ativo</p>
                  <p className="text-xs text-[#94a3b8]">Folha ≥ 28% do faturamento → Anexo V cai para 6%</p>
                </div>
                <button className="w-12 h-6 bg-[#fcdc5d] rounded-full relative">
                  <span className="absolute right-1 top-1 w-4 h-4 bg-[#0a0d14] rounded-full"></span>
                </button>
              </div>
            </div>
          </div>

          {/* Margem e BDI */}
          <div className="bg-[#161c2c] rounded-2xl p-6 border border-[#232b3e]">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="h-6 w-6 text-[#fcdc5d]" />
              <h3 className="text-lg font-bold font-outfit">Margem e BDI</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-[#94a3b8] mb-2">Margem Padrão (%)</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    defaultValue={20}
                    className="flex-1 bg-[#111622] border border-[#232b3e] rounded-xl px-4 py-3 text-[#f8fafc] focus:outline-none focus:border-[#fcdc5d]"
                  />
                  <span className="text-[#94a3b8]">%</span>
                </div>
              </div>
              <div>
                <label className="block text-sm text-[#94a3b8] mb-2">Custo Fixo Mensal (R$)</label>
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    type="number" 
                    defaultValue={9000}
                    placeholder="Mínimo"
                    className="bg-[#111622] border border-[#232b3e] rounded-xl px-4 py-3 text-[#f8fafc] focus:outline-none focus:border-[#fcdc5d]"
                  />
                  <input 
                    type="number" 
                    defaultValue={13000}
                    placeholder="Máximo"
                    className="bg-[#111622] border border-[#232b3e] rounded-xl px-4 py-3 text-[#f8fafc] focus:outline-none focus:border-[#fcdc5d]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-[#94a3b8] mb-2">Horas Úteis/Mês</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    defaultValue={320}
                    className="flex-1 bg-[#111622] border border-[#232b3e] rounded-xl px-4 py-3 text-[#f8fafc] focus:outline-none focus:border-[#fcdc5d]"
                  />
                  <span className="text-[#94a3b8]">h</span>
                </div>
                <p className="text-xs text-[#94a3b8] mt-1">BDI = (9000+13000)/2 / 320 = R$ 34,38/h</p>
              </div>
            </div>
          </div>

          {/* Materiais */}
          <div className="bg-[#161c2c] rounded-2xl p-6 border border-[#232b3e]">
            <div className="flex items-center gap-3 mb-4">
              <Wrench className="h-6 w-6 text-[#fcdc5d]" />
              <h3 className="text-lg font-bold font-outfit">Materiais e Logística</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-[#94a3b8] mb-2">Markup Material (%)</label>
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    type="number" 
                    defaultValue={20}
                    placeholder="Mínimo"
                    className="bg-[#111622] border border-[#232b3e] rounded-xl px-4 py-3 text-[#f8fafc] focus:outline-none focus:border-[#fcdc5d]"
                  />
                  <input 
                    type="number" 
                    defaultValue={30}
                    placeholder="Máximo"
                    className="bg-[#111622] border border-[#232b3e] rounded-xl px-4 py-3 text-[#f8fafc] focus:outline-none focus:border-[#fcdc5d]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-[#94a3b8] mb-2">Km Rodado (R$/km)</label>
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    type="number" 
                    defaultValue={1.8}
                    step="0.1"
                    placeholder="Mínimo"
                    className="bg-[#111622] border border-[#232b3e] rounded-xl px-4 py-3 text-[#f8fafc] focus:outline-none focus:border-[#fcdc5d]"
                  />
                  <input 
                    type="number" 
                    defaultValue={2.5}
                    step="0.1"
                    placeholder="Máximo"
                    className="bg-[#111622] border border-[#232b3e] rounded-xl px-4 py-3 text-[#f8fafc] focus:outline-none focus:border-[#fcdc5d]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-[#94a3b8] mb-2">Alimentação (R$/dia/pessoa)</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    defaultValue={70}
                    className="flex-1 bg-[#111622] border border-[#232b3e] rounded-xl px-4 py-3 text-[#f8fafc] focus:outline-none focus:border-[#fcdc5d]"
                  />
                  <span className="text-[#94a3b8]">R$</span>
                </div>
              </div>
              <div>
                <label className="block text-sm text-[#94a3b8] mb-2">Saída Mínima Predial</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    defaultValue={50}
                    className="flex-1 bg-[#111622] border border-[#232b3e] rounded-xl px-4 py-3 text-[#f8fafc] focus:outline-none focus:border-[#fcdc5d]"
                  />
                  <span className="text-[#94a3b8]">R$</span>
                </div>
              </div>
            </div>
          </div>

          {/* Outros */}
          <div className="bg-[#161c2c] rounded-2xl p-6 border border-[#232b3e]">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="h-6 w-6 text-[#fcdc5d]" />
              <h3 className="text-lg font-bold font-outfit">Outros Parâmetros</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-[#94a3b8] mb-2">Garantia (dias)</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    defaultValue={90}
                    className="flex-1 bg-[#111622] border border-[#232b3e] rounded-xl px-4 py-3 text-[#f8fafc] focus:outline-none focus:border-[#fcdc5d]"
                  />
                  <span className="text-[#94a3b8]">dias</span>
                </div>
              </div>
              <div>
                <label className="block text-sm text-[#94a3b8] mb-2">ART Padrão (R$)</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    defaultValue={120}
                    className="flex-1 bg-[#111622] border border-[#232b3e] rounded-xl px-4 py-3 text-[#f8fafc] focus:outline-none focus:border-[#fcdc5d]"
                  />
                  <span className="text-[#94a3b8]">R$</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Linhas de Serviço e Recursos */}
        <section className="mt-8">
          <h3 className="text-xl font-bold font-outfit mb-4">Linhas de Serviço e Recursos</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[#161c2c] rounded-2xl p-6 border border-[#232b3e]">
              <h4 className="font-semibold mb-4">Linhas de Serviço</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center justify-between p-3 bg-[#111622] rounded-xl">
                  <span>NR12 - Adequação de Máquinas</span>
                  <span className="text-[#94a3b8]">Anexo III</span>
                </li>
                <li className="flex items-center justify-between p-3 bg-[#111622] rounded-xl">
                  <span>Automação Industrial / Retrofit</span>
                  <span className="text-[#94a3b8]">Anexo V</span>
                </li>
                <li className="flex items-center justify-between p-3 bg-[#111622] rounded-xl">
                  <span>Parada Programada de Manutenção</span>
                  <span className="text-[#94a3b8]">Anexo III</span>
                </li>
                <li className="flex items-center justify-between p-3 bg-[#111622] rounded-xl">
                  <span>Contrato Mensal (Preventivo)</span>
                  <span className="text-[#94a3b8]">Anexo III</span>
                </li>
              </ul>
            </div>

            <div className="bg-[#161c2c] rounded-2xl p-6 border border-[#232b3e]">
              <h4 className="font-semibold mb-4">Recursos (Equipe)</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center justify-between p-3 bg-[#111622] rounded-xl">
                  <span>Kiones — Sênior Automação</span>
                  <span className="text-[#fcdc5d]">Venda: R$ 200-300/h</span>
                </li>
                <li className="flex items-center justify-between p-3 bg-[#111622] rounded-xl">
                  <span>Dioleno — Técnico Pleno</span>
                  <span className="text-[#fcdc5d]">Venda: R$ 120-150/h</span>
                </li>
                <li className="flex items-center justify-between p-3 bg-[#111622] rounded-xl">
                  <span>Maike — Eng. Eletricista (ART)</span>
                  <span className="text-[#fcdc5d]">Venda: R$ 150-200/h</span>
                </li>
                <li className="flex items-center justify-between p-3 bg-[#111622] rounded-xl">
                  <span>Eletricista Industrial (Campo)</span>
                  <span className="text-[#94a3b8]">Venda: R$ 80-100/h | Custo: R$ 35-50/h</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <button className="bg-[#fcdc5d] hover:bg-[#f5cb3c] text-[#0a0d14] font-semibold py-3 px-8 rounded-xl transition-all drop-shadow-[0_0_15px_rgba(252,220,93,0.3)]">
            Salvar Configurações
          </button>
        </div>
      </main>
    </div>
  );
}
