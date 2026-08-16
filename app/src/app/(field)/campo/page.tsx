'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Wrench, Wifi, WifiOff, MapPin, Clock, CheckCircle2, 
  AlertTriangle, RefreshCw, Send, User, FileCheck, ShieldCheck, 
  ArrowLeft, HardHat, Zap, Moon, AlertOctagon, CheckSquare, 
  ChevronRight, Sparkles, Navigation
} from 'lucide-react';
import Link from 'next/link';
import SignaturePad from '@/components/campo/SignaturePad';
import { 
  calcularAdicionais, 
  gerarHashSHA256, 
  gerarTextoTermoGarantia, 
  type OutboxItem, 
  type ApontamentoPayload,
  type AssinaturaPayload 
} from '@/core/offline-sync';
import { createClient } from '@/lib/supabase/client';

interface OrdemServicoLocal {
  id: string;
  codigo: number;
  cliente_nome: string;
  servico_descricao: string;
  endereco: string;
  status: string;
}

const OS_EXEMPLO_PADRAO: OrdemServicoLocal = {
  id: 'os-101-nr12',
  codigo: 101,
  cliente_nome: 'Cerâmica São Paulo & Cia',
  servico_descricao: 'Adequação NR12 em Prensa Hidráulica e Painel de Força',
  endereco: 'Rod. Washington Luís, km 178 - Rio Claro/SP',
  status: 'em_execucao',
};

export default function CampoPWA() {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [outbox, setOutbox] = useState<OutboxItem[]>([]);
  const [osAtiva, setOsAtiva] = useState<OrdemServicoLocal>(OS_EXEMPLO_PADRAO);
  
  // Estados de Abas / Modais do Técnico
  const [abaAtiva, setAbaAtiva] = useState<'status' | 'horas' | 'assinatura' | 'monitor'>('status');
  
  // Estado de Check-in / Check-out
  const [checkinRealizado, setCheckinRealizado] = useState<string | null>(null);
  const [checkoutRealizado, setCheckoutRealizado] = useState<string | null>(null);
  const [geoLocalizacao, setGeoLocalizacao] = useState<{ lat: number; lng: number } | null>(null);

  // Estado de Apontamento de Horas
  const [tecnicoNome, setTecnicoNome] = useState('Kiones Peregrino');
  const [horasTrabalhadas, setHorasTrabalhadas] = useState(8);
  const [adicionais, setAdicionais] = useState({
    periculosidade: true,
    noturno: false,
    parada_fim_semana: false,
    nr33_nr35: false,
    atmosfera_explosiva: false,
    ruido_poeira: false,
  });

  // Estado da Assinatura
  const [signatarioNome, setSignatarioNome] = useState('');
  const [signatarioDoc, setSignatarioDoc] = useState('');
  const [assinaturaBase64, setAssinaturaBase64] = useState('');
  const [assinaturaSalva, setAssinaturaSalva] = useState(false);
  const [hashTermo, setHashTermo] = useState<string | null>(null);

  // Status de Sincronização
  const [sincronizando, setSincronizando] = useState(false);
  const [mensagemStatus, setMensagemStatus] = useState<string | null>(null);

  const supabase = createClient();

  // Monitorar conectividade online / offline
  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      sincronizarOutbox();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Carregar outbox salva no storage local
    try {
      const salva = localStorage.getItem('tecmanutencao_outbox');
      if (salva) {
        setOutbox(JSON.parse(salva));
      }
    } catch (e) {
      console.warn('Erro ao carregar outbox do storage local:', e);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Salvar outbox no storage local
  const salvarOutboxLocal = (novaOutbox: OutboxItem[]) => {
    setOutbox(novaOutbox);
    try {
      localStorage.setItem('tecmanutencao_outbox', JSON.stringify(novaOutbox));
    } catch (e) {
      console.warn('Erro ao salvar outbox local:', e);
    }
  };

  // Capturar geolocalização do dispositivo
  const obterGeolocalizacao = (): Promise<{ lat: number; lng: number } | null> => {
    return new Promise((resolve) => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
            setGeoLocalizacao(loc);
            resolve(loc);
          },
          (err) => {
            console.warn('Geolocalização não concedida ou indisponível:', err);
            resolve(null);
          },
          { enableHighAccuracy: true, timeout: 5000 }
        );
      } else {
        resolve(null);
      }
    });
  };

  // Registrar Check-in no local
  const handleCheckin = async () => {
    const geo = await obterGeolocalizacao();
    const agora = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    setCheckinRealizado(agora);

    const novoItem: OutboxItem = {
      sync_id: crypto.randomUUID(),
      tipo: 'checkin',
      payload: {
        os_id: osAtiva.id,
        hora: agora,
        geo,
        status_novo: 'em_execucao',
      },
      status: 'pendente',
      tentativas: 0,
      criado_em: new Date().toISOString(),
      atualizado_em: new Date().toISOString(),
    };

    salvarOutboxLocal([...outbox, novoItem]);
    setMensagemStatus(`✓ Check-in registrado às ${agora}`);
    setTimeout(() => setMensagemStatus(null), 3000);
  };

  // Registrar Check-out
  const handleCheckout = async () => {
    const geo = await obterGeolocalizacao();
    const agora = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    setCheckoutRealizado(agora);

    const novoItem: OutboxItem = {
      sync_id: crypto.randomUUID(),
      tipo: 'checkout',
      payload: {
        os_id: osAtiva.id,
        hora: agora,
        geo,
        status_novo: 'concluida',
      },
      status: 'pendente',
      tentativas: 0,
      criado_em: new Date().toISOString(),
      atualizado_em: new Date().toISOString(),
    };

    salvarOutboxLocal([...outbox, novoItem]);
    setMensagemStatus(`✓ Check-out registrado às ${agora}`);
    setTimeout(() => setMensagemStatus(null), 3000);
  };

  // Salvar Apontamento de Horas e Adicionais
  const handleSalvarApontamento = async () => {
    const geo = await obterGeolocalizacao();
    const calc = calcularAdicionais(100, horasTrabalhadas, adicionais);

    const apontamento: ApontamentoPayload = {
      sync_id: crypto.randomUUID(),
      os_id: osAtiva.id,
      recurso_nome: tecnicoNome,
      data: new Date().toISOString().split('T')[0],
      horas: horasTrabalhadas,
      adicionais,
      geo: geo ? { latitude: geo.lat, longitude: geo.lng } : undefined,
      criado_em: new Date().toISOString(),
    };

    const novoItem: OutboxItem = {
      sync_id: apontamento.sync_id,
      tipo: 'apontamento',
      payload: apontamento,
      status: 'pendente',
      tentativas: 0,
      criado_em: new Date().toISOString(),
      atualizado_em: new Date().toISOString(),
    };

    salvarOutboxLocal([...outbox, novoItem]);
    setMensagemStatus(`✓ ${horasTrabalhadas}h apontadas com sucesso! (+${calc.percentualTotal}% adicionais)`);
    setTimeout(() => setMensagemStatus(null), 3500);
    setAbaAtiva('status');
  };

  // Salvar Assinatura e Termo de Garantia
  const handleSalvarAssinatura = async () => {
    if (!signatarioNome.trim() || !signatarioDoc.trim() || !assinaturaBase64) {
      alert('Por favor, informe o nome, documento e assine na tela.');
      return;
    }

    const geo = await obterGeolocalizacao();
    const textoTermo = gerarTextoTermoGarantia(osAtiva.codigo, osAtiva.cliente_nome, osAtiva.servico_descricao);
    const hash = await gerarHashSHA256(textoTermo + signatarioDoc + Date.now());
    setHashTermo(hash);

    const assinaturaPayload: AssinaturaPayload = {
      sync_id: crypto.randomUUID(),
      os_id: osAtiva.id,
      signatario_nome: signatarioNome.trim(),
      signatario_doc: signatarioDoc.trim(),
      imagem_base64: assinaturaBase64,
      hash_documento: hash,
      termo_versao: 1,
      geo: geo ? { latitude: geo.lat, longitude: geo.lng } : undefined,
      user_agent: navigator.userAgent,
      assinado_em: new Date().toISOString(),
    };

    const novoItem: OutboxItem = {
      sync_id: assinaturaPayload.sync_id,
      tipo: 'assinatura',
      payload: assinaturaPayload,
      status: 'pendente',
      tentativas: 0,
      criado_em: new Date().toISOString(),
      atualizado_em: new Date().toISOString(),
    };

    salvarOutboxLocal([...outbox, novoItem]);
    setAssinaturaSalva(true);
    setMensagemStatus('✓ Assinatura e Termo de Garantia 90 dias registrados com sucesso!');
    setTimeout(() => setMensagemStatus(null), 4000);
  };

  // Sincronizar Outbox com o Servidor / Supabase
  const sincronizarOutbox = async () => {
    const pendentes = outbox.filter((item) => item.status === 'pendente' || item.status === 'erro');
    if (pendentes.length === 0) {
      setMensagemStatus('Tudo já está sincronizado!');
      setTimeout(() => setMensagemStatus(null), 2500);
      return;
    }

    setSincronizando(true);

    try {
      const res = await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: pendentes }),
      });

      if (!res.ok) throw new Error('Falha na resposta do servidor de sync');

      const data = await res.json();
      
      // Atualizar status dos itens sincronizados
      const sucessoIds = new Set(
        data.resultados?.filter((r: any) => r.status === 'sucesso').map((r: any) => r.sync_id) || []
      );

      const novaOutbox = outbox.map((item) =>
        sucessoIds.has(item.sync_id)
          ? { ...item, status: 'sincronizado' as const, atualizado_em: new Date().toISOString() }
          : item
      );

      salvarOutboxLocal(novaOutbox);
      setMensagemStatus(`✓ ${sucessoIds.size} itens sincronizados com o Supabase!`);
    } catch (err: any) {
      console.error('Erro na sincronização:', err);
      setMensagemStatus('⚠ Não foi possível conectar ao servidor. Dados preservados offline.');
    } finally {
      setSincronizando(false);
      setTimeout(() => setMensagemStatus(null), 4000);
    }
  };

  const pendentesCount = outbox.filter((i) => i.status === 'pendente' || i.status === 'erro').length;
  const calculoHorasAtual = calcularAdicionais(100, horasTrabalhadas, adicionais);

  return (
    <div className="min-h-screen bg-[#0a0d14] text-[#f8fafc] pb-24 select-none">
      {/* Header Mobile-First */}
      <header className="border-b border-[#232b3e] bg-[#111622] sticky top-0 z-40 shadow-md">
        <div className="px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="p-2 rounded-xl bg-[#161c2c] border border-[#232b3e] text-[#94a3b8] hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold font-outfit text-white leading-none">PWA de Campo</h1>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#fcdc5d]/10 text-[#fcdc5d] border border-[#fcdc5d]/30">
                  OS #{osAtiva.codigo}
                </span>
              </div>
              <p className="text-[11px] text-[#94a3b8] mt-1 truncate max-w-[200px]">{osAtiva.cliente_nome}</p>
            </div>
          </div>

          {/* Status Conexão */}
          <div className="flex items-center gap-2">
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold ${
                isOnline
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
              }`}
            >
              {isOnline ? (
                <>
                  <Wifi className="w-3.5 h-3.5" />
                  <span>Online</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5 animate-pulse" />
                  <span>Offline</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Feedback Banner */}
        {mensagemStatus && (
          <div className="bg-[#fcdc5d] text-[#0a0d14] text-xs font-bold px-4 py-2 text-center transition-all flex items-center justify-center gap-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{mensagemStatus}</span>
          </div>
        )}
      </header>

      {/* Main Container */}
      <main className="px-4 py-4 max-w-lg mx-auto space-y-4">
        {/* Card Resumo da OS */}
        <section className="bg-[#161c2c] rounded-2xl p-4 border border-[#232b3e] shadow-lg">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#94a3b8]">Ordem de Serviço</span>
              <h2 className="text-base font-bold text-white leading-snug">{osAtiva.cliente_nome}</h2>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 uppercase">
              {osAtiva.status.replace('_', ' ')}
            </span>
          </div>

          <p className="text-xs text-[#94a3b8] mb-3 leading-relaxed">
            {osAtiva.servico_descricao}
          </p>

          <div className="flex items-center gap-1.5 text-xs text-[#94a3b8] pt-2.5 border-t border-[#232b3e]">
            <MapPin className="w-3.5 h-3.5 text-[#fcdc5d] shrink-0" />
            <span className="truncate">{osAtiva.endereco}</span>
          </div>
        </section>

        {/* Abas de Ação Rápida */}
        <div className="grid grid-cols-4 gap-1.5 bg-[#111622] p-1.5 rounded-2xl border border-[#232b3e]">
          <button
            onClick={() => setAbaAtiva('status')}
            className={`py-2.5 px-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all ${
              abaAtiva === 'status'
                ? 'bg-[#fcdc5d] text-[#0a0d14] shadow'
                : 'text-[#94a3b8] hover:text-white'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Ponto</span>
          </button>

          <button
            onClick={() => setAbaAtiva('horas')}
            className={`py-2.5 px-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all ${
              abaAtiva === 'horas'
                ? 'bg-[#fcdc5d] text-[#0a0d14] shadow'
                : 'text-[#94a3b8] hover:text-white'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Horas</span>
          </button>

          <button
            onClick={() => setAbaAtiva('assinatura')}
            className={`py-2.5 px-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all ${
              abaAtiva === 'assinatura'
                ? 'bg-[#fcdc5d] text-[#0a0d14] shadow'
                : 'text-[#94a3b8] hover:text-white'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>Assinar</span>
          </button>

          <button
            onClick={() => setAbaAtiva('monitor')}
            className={`py-2.5 px-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all relative ${
              abaAtiva === 'monitor'
                ? 'bg-[#fcdc5d] text-[#0a0d14] shadow'
                : 'text-[#94a3b8] hover:text-white'
            }`}
          >
            <RefreshCw className="w-4 h-4" />
            <span>Sync</span>
            {pendentesCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-[10px] flex items-center justify-center font-mono font-bold animate-pulse">
                {pendentesCount}
              </span>
            )}
          </button>
        </div>

        {/* ABA 1: Check-in / Check-out */}
        {abaAtiva === 'status' && (
          <section className="bg-[#161c2c] rounded-2xl p-5 border border-[#232b3e] shadow-lg space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Navigation className="w-4 h-4 text-[#fcdc5d]" />
              <span>Registro de Chegada e Saída (GPS)</span>
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleCheckin}
                className={`py-4 px-4 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all active:scale-95 ${
                  checkinRealizado
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                    : 'bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
                }`}
              >
                <CheckCircle2 className="w-6 h-6" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  {checkinRealizado ? `Check-in ${checkinRealizado}` : 'Fazer Check-in'}
                </span>
              </button>

              <button
                type="button"
                onClick={handleCheckout}
                className={`py-4 px-4 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all active:scale-95 ${
                  checkoutRealizado
                    ? 'bg-red-500/20 border-red-500/40 text-red-300'
                    : 'bg-red-500/10 hover:bg-red-500/20 border-red-500/30 text-red-400'
                }`}
              >
                <Clock className="w-6 h-6" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  {checkoutRealizado ? `Check-out ${checkoutRealizado}` : 'Fazer Check-out'}
                </span>
              </button>
            </div>

            {geoLocalizacao && (
              <p className="text-[11px] text-[#94a3b8] text-center font-mono">
                GPS: {geoLocalizacao.lat.toFixed(5)}, {geoLocalizacao.lng.toFixed(5)}
              </p>
            )}
          </section>
        )}

        {/* ABA 2: Apontamento de Horas e Adicionais */}
        {abaAtiva === 'horas' && (
          <section className="bg-[#161c2c] rounded-2xl p-5 border border-[#232b3e] shadow-lg space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <HardHat className="w-4 h-4 text-[#fcdc5d]" />
              <span>Apontamento de Homem-Hora (HH)</span>
            </h3>

            <div>
              <label className="block text-[11px] font-semibold text-[#94a3b8] mb-1.5 uppercase">
                Profissional / Técnico
              </label>
              <select
                value={tecnicoNome}
                onChange={(e) => setTecnicoNome(e.target.value)}
                className="w-full px-3.5 py-3 bg-[#111622] border border-[#232b3e] rounded-xl text-white text-sm focus:border-[#fcdc5d] focus:outline-none"
              >
                <option value="Kiones Peregrino">Kiones Peregrino (Liderança / Sócio)</option>
                <option value="Dioleno">Dioleno (Automação / CLP)</option>
                <option value="Maike">Maike (Engenharia / NR12)</option>
                <option value="Eletricista Industrial">Eletricista Industrial</option>
                <option value="Ajudante">Ajudante</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-[11px] font-semibold text-[#94a3b8] uppercase">
                  Horas Trabalhadas
                </label>
                <span className="text-sm font-bold text-[#fcdc5d] font-mono">{horasTrabalhadas} horas</span>
              </div>
              <input
                type="range"
                min="1"
                max="16"
                step="0.5"
                value={horasTrabalhadas}
                onChange={(e) => setHorasTrabalhadas(Number(e.target.value))}
                className="w-full accent-[#fcdc5d] cursor-pointer"
              />
            </div>

            {/* Adicionais com Toggle */}
            <div className="space-y-2 pt-2 border-t border-[#232b3e]">
              <span className="block text-[11px] font-semibold text-[#94a3b8] uppercase mb-2">
                Adicionais Aplicáveis (Seção 7.7)
              </span>

              <label className="flex items-center justify-between p-3 rounded-xl bg-[#111622] border border-[#232b3e] cursor-pointer hover:border-[#384561]">
                <div className="flex items-center gap-2.5">
                  <Zap className="w-4 h-4 text-[#fcdc5d]" />
                  <div>
                    <p className="text-xs font-bold text-white">Periculosidade</p>
                    <p className="text-[10px] text-[#94a3b8]">Linha viva / AT / MT (+30%)</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={adicionais.periculosidade}
                  onChange={(e) => setAdicionais({ ...adicionais, periculosidade: e.target.checked })}
                  className="w-4 h-4 rounded accent-[#fcdc5d]"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-[#111622] border border-[#232b3e] cursor-pointer hover:border-[#384561]">
                <div className="flex items-center gap-2.5">
                  <Moon className="w-4 h-4 text-blue-400" />
                  <div>
                    <p className="text-xs font-bold text-white">Trabalho Noturno</p>
                    <p className="text-[10px] text-[#94a3b8]">Horário 22h às 05h (+50%)</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={adicionais.noturno}
                  onChange={(e) => setAdicionais({ ...adicionais, noturno: e.target.checked })}
                  className="w-4 h-4 rounded accent-[#fcdc5d]"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-[#111622] border border-[#232b3e] cursor-pointer hover:border-[#384561]">
                <div className="flex items-center gap-2.5">
                  <AlertOctagon className="w-4 h-4 text-orange-400" />
                  <div>
                    <p className="text-xs font-bold text-white">Parada / Fim de Semana</p>
                    <p className="text-[10px] text-[#94a3b8]">Regime de Parada (+50%)</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={adicionais.parada_fim_semana}
                  onChange={(e) => setAdicionais({ ...adicionais, parada_fim_semana: e.target.checked })}
                  className="w-4 h-4 rounded accent-[#fcdc5d]"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-[#111622] border border-[#232b3e] cursor-pointer hover:border-[#384561]">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <div>
                    <p className="text-xs font-bold text-white">Espaço Confinado / Altura</p>
                    <p className="text-[10px] text-[#94a3b8]">NR-33 / NR-35 (+R$ 80/dia)</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={adicionais.nr33_nr35}
                  onChange={(e) => setAdicionais({ ...adicionais, nr33_nr35: e.target.checked })}
                  className="w-4 h-4 rounded accent-[#fcdc5d]"
                />
              </label>
            </div>

            {/* Resumo do Cálculo */}
            <div className="bg-[#111622] p-3 rounded-xl border border-[#232b3e] flex justify-between items-center text-xs">
              <span className="text-[#94a3b8]">Acréscimo Total:</span>
              <span className="font-bold text-[#fcdc5d] font-mono">
                +{calculoHorasAtual.percentualTotal}%
                {calculoHorasAtual.valorFixoDiario > 0 && ` + R$ ${calculoHorasAtual.valorFixoDiario}`}
              </span>
            </div>

            <button
              type="button"
              onClick={handleSalvarApontamento}
              className="w-full py-3.5 bg-[#fcdc5d] hover:bg-[#f5cb3c] text-[#0a0d14] font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg active:scale-98"
            >
              <CheckSquare className="w-4 h-4" />
              <span>Confirmar Apontamento</span>
            </button>
          </section>
        )}

        {/* ABA 3: Assinatura Touch & Termo de Garantia */}
        {abaAtiva === 'assinatura' && (
          <section className="bg-[#161c2c] rounded-2xl p-5 border border-[#232b3e] shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-[#fcdc5d]" />
                <span>Termo de Entrega & Garantia 90 Dias</span>
              </h3>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                Auditoria Legal
              </span>
            </div>

            <div className="bg-[#111622] p-3 rounded-xl border border-[#232b3e] text-[11px] text-[#94a3b8] leading-relaxed">
              O cliente atesta a conclusão dos serviços de <strong>{osAtiva.servico_descricao}</strong> e comissionamento dos equipamentos com garantia legal de <strong>90 dias</strong> (Seção 13 do Master Doc).
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#94a3b8] mb-1.5 uppercase">
                Nome do Responsável / Cliente *
              </label>
              <input
                type="text"
                value={signatarioNome}
                onChange={(e) => setSignatarioNome(e.target.value)}
                placeholder="Ex: Carlos Mendes"
                className="w-full px-3.5 py-2.5 bg-[#111622] border border-[#232b3e] rounded-xl text-white text-sm focus:border-[#fcdc5d] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#94a3b8] mb-1.5 uppercase">
                CPF ou RG do Signatário *
              </label>
              <input
                type="text"
                value={signatarioDoc}
                onChange={(e) => setSignatarioDoc(e.target.value)}
                placeholder="Ex: 123.456.789-00"
                className="w-full px-3.5 py-2.5 bg-[#111622] border border-[#232b3e] rounded-xl text-white text-sm focus:border-[#fcdc5d] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#94a3b8] mb-1.5 uppercase">
                Assinatura na Tela (Touch) *
              </label>
              <SignaturePad onSave={setAssinaturaBase64} disabled={assinaturaSalva} />
            </div>

            {hashTermo && (
              <div className="p-2.5 rounded-xl bg-[#111622] border border-[#232b3e] text-[10px] text-[#94a3b8] font-mono break-all">
                Hash SHA-256: {hashTermo}
              </div>
            )}

            <button
              type="button"
              onClick={handleSalvarAssinatura}
              disabled={assinaturaSalva}
              className="w-full py-3.5 bg-[#fcdc5d] hover:bg-[#f5cb3c] text-[#0a0d14] font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg disabled:opacity-50"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{assinaturaSalva ? '✓ Assinatura Gravada' : 'Finalizar e Assinar OS'}</span>
            </button>
          </section>
        )}

        {/* ABA 4: Monitor de Sincronização */}
        {abaAtiva === 'monitor' && (
          <section className="bg-[#161c2c] rounded-2xl p-5 border border-[#232b3e] shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-[#fcdc5d]" />
                  <span>Monitor de Sincronização (Outbox)</span>
                </h3>
                <p className="text-[11px] text-[#94a3b8]">
                  {pendentesCount > 0
                    ? `${pendentesCount} item(ns) aguardando sincronização`
                    : 'Todos os registros estão sincronizados'}
                </p>
              </div>

              <button
                type="button"
                onClick={sincronizarOutbox}
                disabled={sincronizando || !isOnline}
                className="px-3.5 py-2 bg-[#fcdc5d] hover:bg-[#f5cb3c] text-[#0a0d14] font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${sincronizando ? 'animate-spin' : ''}`} />
                <span>Sync</span>
              </button>
            </div>

            {outbox.length === 0 ? (
              <div className="p-8 text-center bg-[#111622] rounded-xl border border-[#232b3e]">
                <p className="text-xs text-[#94a3b8]">Nenhum registro na fila de envio.</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {outbox.map((item) => (
                  <div
                    key={item.sync_id}
                    className="p-3 rounded-xl bg-[#111622] border border-[#232b3e] flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-white uppercase tracking-wider text-[10px] block">
                        {item.tipo}
                      </span>
                      <span className="text-[10px] text-[#94a3b8] font-mono">
                        {new Date(item.criado_em).toLocaleTimeString('pt-BR')}
                      </span>
                    </div>

                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border uppercase ${
                        item.status === 'sincronizado'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : item.status === 'erro'
                          ? 'bg-red-500/10 text-red-400 border-red-500/30'
                          : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
