'use client';

import { useState, useRef, useEffect } from 'react';
import { Wrench, Camera, Mic, Send, X, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface Midia {
  tipo: 'imagem' | 'video' | 'audio';
  file: File;
  preview?: string;
}

interface MensagemChat {
  id: string;
  remetente: 'usuario' | 'sistema';
  texto: string;
  tipo?: 'normal' | 'emergencia' | 'sucesso';
}

const LIMITES = {
  MAX_MIDIAS: 3,
  MAX_VIDEO_MB: 20,
  MAX_AUDIO_MIN: 5,
};

export default function AtendimentoPublico() {
  const [nome, setNome] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [descricao, setDescricao] = useState('');
  const [midias, setMidias] = useState<Midia[]>([]);
  const [consentimento, setConsentimento] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [mensagens, setMensagens] = useState<MensagemChat[]>([]);
  const [erros, setErros] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  // Validação de WhatsApp em tempo real
  const validarWhatsApp = (valor: string) => {
    const limpo = valor.replace(/\D/g, '');
    if (limpo.length < 10) return 'WhatsApp inválido';
    if (limpo.length > 11) return 'WhatsApp muito longo';
    return '';
  };

  // Adicionar mídia com validações
  const adicionarMidia = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const novosErros: Record<string, string> = {};
    const novasMidias: Midia[] = [];

    for (const file of files) {
      // Validação MIME
      const mimeValido = file.type.startsWith('image/') || 
                        file.type.startsWith('video/') || 
                        file.type.startsWith('audio/');
      
      if (!mimeValido) {
        novosErros[file.name] = 'Formato não suportado';
        continue;
      }

      // Limite de quantidade
      if (midias.length + novasMidias.length >= LIMITES.MAX_MIDIAS) {
        novosErros[file.name] = `Máximo de ${LIMITES.MAX_MIDIAS} mídias`;
        continue;
      }

      // Limites de tamanho
      if (file.type.startsWith('video/') && file.size > LIMITES.MAX_VIDEO_MB * 1024 * 1024) {
        novosErros[file.name] = `Vídeo deve ter até ${LIMITES.MAX_VIDEO_MB}MB`;
        continue;
      }

      if (file.type.startsWith('audio/')) {
        // Validação de duração para áudio (placeholder - implementação real requer metadata)
        // TODO-BUSINESS: Implementar validação de duração de áudio via Web Audio API
      }

      // Criar preview para imagens
      let preview: string | undefined;
      if (file.type.startsWith('image/')) {
        preview = URL.createObjectURL(file);
      }

      novasMidias.push({
        tipo: file.type.startsWith('image/') ? 'imagem' : 
              file.type.startsWith('video/') ? 'video' : 'audio',
        file,
        preview,
      });
    }

    setErros(novosErros);
    setMidias([...midias, ...novasMidias]);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Remover mídia
  const removerMidia = (index: number) => {
    const midia = midias[index];
    if (midia.preview) {
      URL.revokeObjectURL(midia.preview);
    }
    setMidias(midias.filter((_, i) => i !== index));
  };

  // Detectar emergência no texto
  const detectarEmergencia = (texto: string): boolean => {
    const termosEmergencia = ['fumaça', 'choque', 'curto', 'curto-circuito', 'faísca', 'incêndio', 'explosão', 'urgente', 'emergência'];
    return termosEmergencia.some(termo => texto.toLowerCase().includes(termo));
  };

  // Enviar solicitação
  const enviarSolicitacao = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setErros({});

    // Validações
    const novosErros: Record<string, string> = {};
    
    if (!nome.trim()) novosErros.nome = 'Nome é obrigatório';
    if (!whatsapp.trim()) novosErros.whatsapp = 'WhatsApp é obrigatório';
    else {
      const erroWhatsapp = validarWhatsApp(whatsapp);
      if (erroWhatsapp) novosErros.whatsapp = erroWhatsapp;
    }
    if (!descricao.trim()) novosErros.descricao = 'Descrição é obrigatória';
    if (!consentimento) novosErros.consentimento = 'É necessário concordar com LGPD';

    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros);
      setEnviando(false);
      return;
    }

    try {
      // Simular chamada à edge function (implementação real abaixo)
      const emergencia = detectarEmergencia(descricao);
      
      // Fluxo de mensagens do chat
      const mensagemInicial: MensagemChat = {
        id: crypto.randomUUID(),
        remetente: 'sistema',
        texto: emergencia 
          ? '⚠️ Situação de emergência detectada! Desligue o equipamento da rede elétrica imediatamente e afaste-se. Nossa equipe priorizará seu atendimento.'
          : 'Recebido! Nossa equipe técnica analisa e envia o orçamento no seu WhatsApp.',
        tipo: emergencia ? 'emergencia' : 'sucesso',
      };

      setMensagens([mensagemInicial]);
      
      // TODO: Chamar edge function fn-lead-capture com payload completo
      // const response = await fetch('https://xxx.supabase.co/functions/v1/lead-capture', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ nome, whatsapp, descricao, midias: [], emergencia }),
      // });

      setEnviado(true);
    } catch (error) {
      console.error('Erro ao enviar:', error);
      setErros({ geral: 'Erro ao enviar. Tente novamente.' });
    } finally {
      setEnviando(false);
    }
  };

  if (enviado) {
    return (
      <div className="min-h-screen bg-[#0a0d14] text-[#f8fafc] flex items-center justify-center p-4">
        <div className="bg-[#161c2c] rounded-2xl p-8 border border-[#232b3e] max-w-md w-full text-center">
          <CheckCircle className="h-16 w-16 text-[#fcdc5d] mx-auto mb-4" />
          <h2 className="text-2xl font-bold font-outfit mb-2">Solicitação Recebida!</h2>
          <p className="text-[#94a3b8] mb-6">
            {mensagens[0]?.tipo === 'emergencia' 
              ? 'Priorizamos emergências. Você será contactado em até 1 hora.'
              : 'Nossa equipe técnica analisa e envia o orçamento no seu WhatsApp.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#fcdc5d] hover:bg-[#f5cb3c] text-[#0a0d14] font-semibold py-3 px-6 rounded-xl transition-all"
          >
            Nova Solicitação
          </button>
        </div>
      </div>
    );
  }

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

        {/* Chat Messages */}
        {mensagens.length > 0 && (
          <div className="mb-6 space-y-3">
            {mensagens.map((msg) => (
              <div
                key={msg.id}
                className={`p-4 rounded-xl border ${
                  msg.tipo === 'emergencia'
                    ? 'bg-red-900/20 border-red-700/50'
                    : msg.tipo === 'sucesso'
                    ? 'bg-green-900/20 border-green-700/50'
                    : 'bg-[#111622] border-[#232b3e]'
                }`}
              >
                <p className={msg.tipo === 'emergencia' ? 'text-red-400' : ''}>{msg.texto}</p>
              </div>
            ))}
          </div>
        )}

        {/* Form */}
        <div className="bg-[#161c2c] rounded-2xl p-6 border border-[#232b3e]">
          <form onSubmit={enviarSolicitacao} className="space-y-6">
            {/* Nome */}
            <div>
              <label className="block text-sm text-[#94a3b8] mb-2">Nome completo</label>
              <input 
                type="text" 
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Seu nome"
                className={`w-full bg-[#111622] border rounded-xl px-4 py-3 text-[#f8fafc] focus:outline-none focus:border-[#fcdc5d] min-h-[48px] ${
                  erros.nome ? 'border-red-500' : 'border-[#232b3e]'
                }`}
              />
              {erros.nome && <p className="text-xs text-red-400 mt-1">{erros.nome}</p>}
            </div>

            {/* WhatsApp */}
            <div>
              <label className="block text-sm text-[#94a3b8] mb-2">WhatsApp</label>
              <input 
                type="tel" 
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="(XX) XXXXX-XXXX"
                className={`w-full bg-[#111622] border rounded-xl px-4 py-3 text-[#f8fafc] focus:outline-none focus:border-[#fcdc5d] min-h-[48px] ${
                  erros.whatsapp ? 'border-red-500' : 'border-[#232b3e]'
                }`}
              />
              {erros.whatsapp && <p className="text-xs text-red-400 mt-1">{erros.whatsapp}</p>}
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-sm text-[#94a3b8] mb-2">Descreva o problema</label>
              <textarea 
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                rows={4}
                placeholder="Conte o que está acontecendo com seu equipamento..."
                className={`w-full bg-[#111622] border rounded-xl px-4 py-3 text-[#f8fafc] focus:outline-none focus:border-[#fcdc5d] resize-none ${
                  erros.descricao ? 'border-red-500' : 'border-[#232b3e]'
                }`}
              />
              {erros.descricao && <p className="text-xs text-red-400 mt-1">{erros.descricao}</p>}
            </div>

            {/* Upload de Mídias */}
            <div>
              <label className="block text-sm text-[#94a3b8] mb-2">Adicione fotos ou vídeos (opcional)</label>
              <div className="grid grid-cols-3 gap-3">
                {midias.map((midia, index) => (
                  <div key={index} className="relative aspect-square">
                    {midia.preview && (
                      <img src={midia.preview} alt="Preview" className="w-full h-full object-cover rounded-xl" />
                    )}
                    <button
                      type="button"
                      onClick={() => removerMidia(index)}
                      className="absolute top-1 right-1 bg-red-600 rounded-full p-1 hover:bg-red-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                {midias.length < LIMITES.MAX_MIDIAS && (
                  <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square bg-[#111622] border-2 border-dashed border-[#232b3e] rounded-xl flex flex-col items-center justify-center gap-2 hover:border-[#fcdc5d] transition-colors min-h-[48px]"
                  >
                    <Camera className="h-6 w-6 text-[#94a3b8]" />
                    <span className="text-xs text-[#94a3b8]">Foto/Vídeo</span>
                  </button>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*,audio/*"
                multiple
                onChange={adicionarMidia}
                className="hidden"
              />
              <p className="text-xs text-[#94a3b8] mt-2">
                Máximo {LIMITES.MAX_MIDIAS} mídias • Vídeo até {LIMITES.MAX_VIDEO_MB}MB • Áudio até {LIMITES.MAX_AUDIO_MIN}min
              </p>
              {Object.keys(erros).some(k => k.endsWith('.mp4') || k.endsWith('.jpg')) && (
                <div className="mt-2 space-y-1">
                  {Object.entries(erros).map(([k, v]) => (
                    <p key={k} className="text-xs text-red-400">{k}: {v}</p>
                  ))}
                </div>
              )}
            </div>

            {/* Consentimento LGPD */}
            <div className="flex items-start gap-3 pt-4 border-t border-[#232b3e]">
              <input 
                type="checkbox" 
                id="lgpd"
                checked={consentimento}
                onChange={(e) => setConsentimento(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-[#232b3e] bg-[#111622] text-[#fcdc5d] focus:ring-[#fcdc5d]"
              />
              <label htmlFor="lgpd" className="text-sm text-[#94a3b8]">
                Concordo com o processamento dos meus dados para fins de orçamento e atendimento técnico. 
                Seus dados serão retidos por 5 anos conforme LGPD.
              </label>
            </div>
            {erros.consentimento && <p className="text-xs text-red-400">{erros.consentimento}</p>}
            {erros.geral && <p className="text-xs text-red-400">{erros.geral}</p>}

            {/* Submit */}
            <button 
              type="submit"
              disabled={enviando}
              className="w-full bg-[#fcdc5d] hover:bg-[#f5cb3c] disabled:bg-[#94a3b8] text-[#0a0d14] font-semibold py-4 px-6 rounded-xl transition-all drop-shadow-[0_0_15px_rgba(252,220,93,0.3)] flex items-center justify-center gap-2 min-h-[48px]"
            >
              {enviando ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  Enviar Solicitação
                </>
              )}
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
