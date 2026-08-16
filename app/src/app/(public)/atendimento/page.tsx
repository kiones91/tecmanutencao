'use client';

import { useState, useRef } from 'react';
import { Wrench, Camera, Send, X, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import Link from 'next/link';
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
    if (limpo.length < 10) return 'WhatsApp inválido (DDD + número)';
    if (limpo.length > 11) return 'WhatsApp muito longo';
    return '';
  };

  // Adicionar mídia com validações
  const adicionarMidia = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const novosErros: Record<string, string> = {};
    const novasMidias: Midia[] = [];

    for (const file of files) {
      const mimeValido = file.type.startsWith('image/') || 
                         file.type.startsWith('video/') || 
                         file.type.startsWith('audio/');
      
      if (!mimeValido) {
        novosErros[file.name] = 'Formato não suportado';
        continue;
      }

      if (midias.length + novasMidias.length >= LIMITES.MAX_MIDIAS) {
        novosErros[file.name] = `Máximo de ${LIMITES.MAX_MIDIAS} mídias`;
        continue;
      }

      if (file.type.startsWith('video/') && file.size > LIMITES.MAX_VIDEO_MB * 1024 * 1024) {
        novosErros[file.name] = `Vídeo deve ter até ${LIMITES.MAX_VIDEO_MB}MB`;
        continue;
      }

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
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removerMidia = (index: number) => {
    const midia = midias[index];
    if (midia.preview) {
      URL.revokeObjectURL(midia.preview);
    }
    setMidias(midias.filter((_, i) => i !== index));
  };

  const detectarEmergencia = (texto: string): boolean => {
    const termosEmergencia = ['fumaça', 'choque', 'curto', 'curto-circuito', 'faísca', 'incêndio', 'explosão', 'urgente', 'emergência', 'parou'];
    return termosEmergencia.some(termo => texto.toLowerCase().includes(termo));
  };

  const enviarSolicitacao = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setErros({});

    const novosErros: Record<string, string> = {};
    
    if (!nome.trim()) novosErros.nome = 'Nome é obrigatório';
    if (!whatsapp.trim()) novosErros.whatsapp = 'WhatsApp é obrigatório';
    else {
      const erroWhatsapp = validarWhatsApp(whatsapp);
      if (erroWhatsapp) novosErros.whatsapp = erroWhatsapp;
    }
    if (!descricao.trim()) novosErros.descricao = 'Descrição é obrigatória';
    if (!consentimento) novosErros.consentimento = 'É necessário concordar com os termos de atendimento';

    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros);
      setEnviando(false);
      return;
    }

    try {
      const emergencia = detectarEmergencia(descricao);
      const whatsappLimpo = whatsapp.replace(/\D/g, '');

      // 1. Enviar para a API de captura de leads
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: nome.trim(),
          whatsapp,
          descricao: descricao.trim(),
          emergencia,
          midiasCount: midias.length,
        }),
      });

      const resData = await response.json();

      if (!response.ok) {
        throw new Error(resData.error || 'Falha ao registrar lead');
      }

      // 2. Upload de mídias para Storage (se houver bucket disponível)
      if (resData.lead?.id && midias.length > 0) {
        for (const m of midias) {
          try {
            const fileName = `${resData.lead.id}/${Date.now()}_${m.file.name.replace(/\s+/g, '_')}`;
            await supabase.storage
              .from('temp-public')
              .upload(fileName, m.file, { upsert: true });
          } catch (storageErr) {
            console.warn('Bucket de storage não configurado ou erro no upload:', storageErr);
          }
        }
      }

      const mensagemInicial: MensagemChat = {
        id: crypto.randomUUID(),
        remetente: 'sistema',
        texto: emergencia 
          ? '⚠️ Situação de emergência detectada! Desligue o equipamento da rede elétrica imediatamente e afaste-se. Nossa equipe técnica foi notificada e priorizará seu contato imediato.'
          : 'Recebido! Nossa equipe técnica analisa sua solicitação e entra em contato via WhatsApp.',
        tipo: emergencia ? 'emergencia' : 'sucesso',
      };

      setMensagens([mensagemInicial]);
      setEnviado(true);
    } catch (error) {
      console.error('Erro ao enviar solicitação:', error);
      setErros({ geral: 'Ocorreu um erro ao processar seu pedido. Tente novamente.' });
    } finally {
      setEnviando(false);
    }
  };

  if (enviado) {
    return (
      <div className="min-h-screen bg-[#0a0d14] text-[#f8fafc] flex items-center justify-center p-4">
        <div className="bg-[#161c2c] rounded-2xl p-8 border border-[#232b3e] max-w-md w-full text-center shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-[#fcdc5d]/10 border border-[#fcdc5d]/30 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-9 w-9 text-[#fcdc5d]" />
          </div>
          <h2 className="text-2xl font-bold font-outfit mb-2 text-white">Solicitação Registrada!</h2>
          <p className="text-[#94a3b8] text-sm leading-relaxed mb-6">
            {mensagens[0]?.tipo === 'emergencia' 
              ? 'Priorizamos emergências industriais. Nossa equipe entrará em contato em minutos.'
              : 'Recebido com sucesso! Nossa equipe técnica analisa e envia o orçamento no seu WhatsApp.'}
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => {
                setEnviado(false);
                setNome('');
                setWhatsapp('');
                setDescricao('');
                setMidias([]);
                setConsentimento(false);
              }}
              className="w-full bg-[#fcdc5d] hover:bg-[#f5cb3c] text-[#0a0d14] font-bold py-3 px-6 rounded-xl transition-all shadow-md"
            >
              Nova Solicitação
            </button>
            <Link
              href="/"
              className="text-xs text-[#94a3b8] hover:text-white transition-colors py-2"
            >
              Voltar ao Início
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0d14] text-[#f8fafc]">
      {/* Header */}
      <header className="border-b border-[#232b3e] bg-[#111622]">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#fcdc5d]/10 border border-[#fcdc5d]/30 flex items-center justify-center">
              <Wrench className="h-5 w-5 text-[#fcdc5d]" />
            </div>
            <div>
              <h1 className="text-lg font-bold font-outfit text-white">TecManutenções</h1>
              <p className="text-xs text-[#94a3b8]">Atendimento Técnico Inteligente — Faísca</p>
            </div>
          </div>
          <Link
            href="/login"
            className="text-xs font-medium text-[#94a3b8] hover:text-[#fcdc5d] transition-colors border border-[#232b3e] px-3 py-1.5 rounded-lg bg-[#161c2c]"
          >
            Área Restrita
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <section className="mb-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold font-outfit mb-2 text-white">
            Precisa de atendimento técnico?
          </h2>
          <p className="text-[#94a3b8] text-sm">
            Descreva seu problema elétrico ou industrial e nossa engenharia avaliará imediatamente.
          </p>
        </section>

        {/* Global Error */}
        {erros.geral && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-800/60 flex items-center gap-3 text-red-300 text-sm">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
            <span>{erros.geral}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={enviarSolicitacao} className="bg-[#161c2c] rounded-2xl p-6 sm:p-8 border border-[#232b3e] shadow-xl space-y-6">
          {/* Nome */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#94a3b8] mb-2">
              Seu Nome ou Empresa *
            </label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: João Silva ou Metalúrgica Brasil"
              className="w-full px-4 py-3 bg-[#111622] border border-[#232b3e] rounded-xl text-white placeholder-[#94a3b8]/40 focus:outline-none focus:border-[#fcdc5d] transition-colors"
            />
            {erros.nome && <p className="text-red-400 text-xs mt-1.5">{erros.nome}</p>}
          </div>

          {/* WhatsApp */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#94a3b8] mb-2">
              WhatsApp para Retorno *
            </label>
            <input
              type="tel"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="Ex: 19999998888"
              className="w-full px-4 py-3 bg-[#111622] border border-[#232b3e] rounded-xl text-white placeholder-[#94a3b8]/40 focus:outline-none focus:border-[#fcdc5d] transition-colors"
            />
            {erros.whatsapp && <p className="text-red-400 text-xs mt-1.5">{erros.whatsapp}</p>}
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#94a3b8] mb-2">
              Descreva o Problema / Serviço Necessário *
            </label>
            <textarea
              rows={4}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Ex: Painel desarmando em carga, necessidade de adequação NR12 em prensa, montagem de infraestrutura..."
              className="w-full px-4 py-3 bg-[#111622] border border-[#232b3e] rounded-xl text-white placeholder-[#94a3b8]/40 focus:outline-none focus:border-[#fcdc5d] transition-colors resize-none"
            />
            {erros.descricao && <p className="text-red-400 text-xs mt-1.5">{erros.descricao}</p>}
          </div>

          {/* Upload de Mídias */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#94a3b8] mb-2">
              Fotos ou Vídeos do Local / Painel (Opcional, até 3)
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={midias.length >= LIMITES.MAX_MIDIAS}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#111622] hover:bg-[#1f283d] border border-[#232b3e] rounded-xl text-sm text-[#94a3b8] hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Camera className="w-4 h-4 text-[#fcdc5d]" />
                <span>Adicionar Arquivo</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*,audio/*"
                onChange={adicionarMidia}
                className="hidden"
              />
              <span className="text-xs text-[#94a3b8]">
                {midias.length}/{LIMITES.MAX_MIDIAS} selecionados
              </span>
            </div>

            {/* Preview de Mídias */}
            {midias.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mt-3">
                {midias.map((m, idx) => (
                  <div key={idx} className="relative rounded-xl overflow-hidden border border-[#232b3e] bg-[#111622] aspect-video flex items-center justify-center group">
                    {m.preview ? (
                      <img src={m.preview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs text-[#94a3b8] uppercase font-mono">{m.tipo}</span>
                    )}
                    <button
                      type="button"
                      onClick={() => removerMidia(idx)}
                      className="absolute top-1 right-1 p-1 bg-black/70 hover:bg-red-600 rounded-full text-white transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* LGPD Consent */}
          <div className="pt-2 border-t border-[#232b3e]">
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={consentimento}
                onChange={(e) => setConsentimento(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-[#232b3e] bg-[#111622] text-[#fcdc5d] focus:ring-0 focus:ring-offset-0 cursor-pointer accent-[#fcdc5d]"
              />
              <span className="text-xs text-[#94a3b8] leading-relaxed">
                Concordo com o envio dos meus dados para contato técnico e elaboração de proposta comercial conforme a LGPD.
              </span>
            </label>
            {erros.consentimento && (
              <p className="text-red-400 text-xs mt-1.5">{erros.consentimento}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={enviando}
            className="w-full py-4 px-6 bg-[#fcdc5d] hover:bg-[#f5cb3c] text-[#0a0d14] font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#fcdc5d]/10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {enviando ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Registrando Solicitação...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Solicitar Atendimento Técnico</span>
              </>
            )}
          </button>
        </form>
      </main>
    </div>
  );
}
