'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Wrench,
  Send,
  Bot,
  User,
  ShieldAlert,
  CheckCircle2,
  Sparkles,
  Clock,
  ArrowLeft,
  Phone,
  Factory,
  Cpu,
  Zap,
  Shield,
  AlertTriangle,
  MessageSquare,
  ChevronRight,
  ExternalLink,
  Loader2,
  HardHat,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface MensagemChat {
  id: string;
  remetente: 'ia' | 'usuario';
  texto: string;
  timestamp: string;
  opcoesRapidas?: { rotulo: string; valor: string; icone?: string }[];
  resumoPedido?: {
    protocolo: string;
    servico: string;
    maquina: string;
    tensao: string;
    empresa: string;
    cidade: string;
    contato: string;
    whatsapp: string;
    urgencia: string;
  };
}

export default function AtendimentoIAPage() {
  const [mensagens, setMensagens] = useState<MensagemChat[]>([
    {
      id: '1',
      remetente: 'ia',
      texto:
        'Olá! Sou o **Faísca ⚡**, Engenheiro Assistente da **TecManutenções**.\n\nEstou aqui para realizar a triagem técnica do seu equipamento industrial e agilizar seu orçamento ou atendimento emergencial de campo. Como posso ajudar sua fábrica hoje?',
      timestamp: 'Agora',
      opcoesRapidas: [
        { rotulo: '🚨 Máquina Parada / Emergência', valor: 'Emergência: Linha/Máquina Parada' },
        { rotulo: '🛡️ Adequação NR-12 com ART', valor: 'Adequação NR-12 com Laudo e ART' },
        { rotulo: '⚡ Automação & Retrofit CLP', valor: 'Automação & Retrofit de Máquinas' },
        { rotulo: '🏭 Parada Programada / QGBT', valor: 'Parada Programada de Manutenção' },
        { rotulo: '📋 Contrato Preventivo Mensal', valor: 'Contrato de Manutenção Preventiva' },
      ],
    },
  ]);

  const [inputTexto, setInputTexto] = useState('');
  const [etapa, setEtapa] = useState<number>(1);
  const [dadosColetados, setDadosColetados] = useState({
    servico: '',
    maquina: '',
    tensao: '',
    sintomas: '',
    empresa: '',
    cidade: '',
    contato_nome: '',
    whatsapp: '',
    urgencia: 'normal',
  });
  const [isDigitando, setIsDigitando] = useState(false);
  const [enviandoLead, setEnviandoLead] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const supabase = createClient();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [mensagens, isDigitando]);

  const adicionarMensagemUsuario = (texto: string) => {
    const novaMsg: MensagemChat = {
      id: String(Date.now()),
      remetente: 'usuario',
      texto,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMensagens((prev) => [...prev, novaMsg]);
  };

  const responderIA = (
    respostaTexto: string,
    opcoes?: { rotulo: string; valor: string }[],
    resumo?: any
  ) => {
    setIsDigitando(true);
    setTimeout(() => {
      setIsDigitando(false);
      setMensagens((prev) => [
        ...prev,
        {
          id: String(Date.now()),
          remetente: 'ia',
          texto: respostaTexto,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          opcoesRapidas: opcoes,
          resumoPedido: resumo,
        },
      ]);
    }, 850);
  };

  const handleOpcaoRapida = (valor: string) => {
    processarFluxo(valor);
  };

  const handleEnviar = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputTexto.trim()) return;
    const texto = inputTexto.trim();
    setInputTexto('');
    processarFluxo(texto);
  };

  const processarFluxo = async (texto: string) => {
    adicionarMensagemUsuario(texto);

    if (etapa === 1) {
      const isEmergencia =
        texto.toLowerCase().includes('emergência') ||
        texto.toLowerCase().includes('parada') ||
        texto.toLowerCase().includes('parou');

      setDadosColetados((prev) => ({
        ...prev,
        servico: texto,
        urgencia: isEmergencia ? 'critica' : 'normal',
      }));
      setEtapa(2);

      responderIA(
        isEmergencia
          ? '🚨 **CASO DE EMERGÊNCIA IDENTIFICADO!**\n\nNossa equipe de plantão 24h já foi alertada. Qual é o equipamento industrial que está inoperante no momento?'
          : 'Excelente. Qual é o equipamento, painel ou linha fabril envolvida neste projeto?',
        [
          { rotulo: 'Prensa Hidráulica / Excêntrica', valor: 'Prensa Hidráulica / Excêntrica' },
          { rotulo: 'Ponte Rolante / Talha', valor: 'Ponte Rolante / Talha Industrial' },
          { rotulo: 'Painel QGBT / Subestação', valor: 'Painel Elétrico / Subestação / QGBT' },
          { rotulo: 'Linha Contínua / Envase', valor: 'Linha Contínua de Produção / Envase' },
          { rotulo: 'Centro de Usinagem / CNC', valor: 'Torno CNC / Centro de Usinagem' },
          { rotulo: 'Outro Equipamento', valor: 'Outro Equipamento Industrial' },
        ]
      );
    } else if (etapa === 2) {
      setDadosColetados((prev) => ({ ...prev, maquina: texto }));
      setEtapa(3);

      responderIA(
        'Anotado. Qual é a tensão elétrica da fábrica e o principal sintoma ou escopo necessário?',
        [
          { rotulo: '220V Trifásico', valor: '220V Trifásico' },
          { rotulo: '380V Trifásico', valor: '380V Trifásico' },
          { rotulo: '440V Industrial', valor: '440V Industrial' },
          { rotulo: 'Cabine / Média Tensão', valor: 'Média Tensão / Cabine Primária' },
        ]
      );
    } else if (etapa === 3) {
      setDadosColetados((prev) => ({ ...prev, tensao: texto }));
      setEtapa(4);

      responderIA(
        'Perfeito. Para localizarmos a equipe mais próxima e calcular o deslocamento técnico: qual é a **Cidade / Estado** e o **Nome da Empresa**?'
      );
    } else if (etapa === 4) {
      setDadosColetados((prev) => ({
        ...prev,
        empresa: texto,
        cidade: texto,
      }));
      setEtapa(5);

      responderIA(
        'Ótimo. Por fim, por favor informe seu **Nome de Contato** e **WhatsApp com DDD** para envio da proposta e contato do engenheiro responsável.'
      );
    } else if (etapa === 5) {
      const protocolo = `TEC-${Math.floor(100000 + Math.random() * 900000)}`;
      const dadosFinais = {
        ...dadosColetados,
        contato_nome: texto,
        whatsapp: texto,
      };
      setDadosColetados(dadosFinais);
      setEtapa(6);
      setEnviandoLead(true);

      // Salvar Lead no Supabase
      try {
        await supabase.from('leads').insert([
          {
            nome: texto,
            whatsapp: texto,
            origem: 'atendimento_ia',
            status: 'novo',
            score: dadosFinais.urgencia === 'critica' ? 95 : 75,
            payload_ia: {
              protocolo,
              servico: dadosFinais.servico,
              maquina: dadosFinais.maquina,
              tensao: dadosFinais.tensao,
              empresa: dadosFinais.empresa,
              cidade: dadosFinais.cidade,
              urgencia: dadosFinais.urgencia,
              resumo: `Protocolo ${protocolo}: ${dadosFinais.servico} em ${dadosFinais.maquina} (${dadosFinais.tensao}). Solicitante: ${texto}.`,
            },
          },
        ]);
      } catch (err) {
        console.error('Erro ao sincronizar lead:', err);
      } finally {
        setEnviandoLead(false);
      }

      responderIA(
        `✅ **Triagem Concluída com Sucesso!**\n\nSeu protocolo técnico é **${protocolo}**. O relatório foi gerado e nossos engenheiros já receberam os detalhes do seu chamado.`,
        undefined,
        {
          protocolo,
          servico: dadosFinais.servico,
          maquina: dadosFinais.maquina,
          tensao: dadosFinais.tensao,
          empresa: dadosFinais.empresa,
          cidade: dadosFinais.cidade,
          contato: texto,
          whatsapp: texto,
          urgencia: dadosFinais.urgencia,
        }
      );
    }
  };

  const getWhatsAppLink = (resumo: any) => {
    const textoZap = `Olá Engenharia TecManutenções!%0A%0A*PROTOCOLO TÉCNICO:* ${resumo.protocolo}%0A*SERVIÇO:* ${resumo.servico}%0A*EQUIPAMENTO:* ${resumo.maquina}%0A*TENSÃO:* ${resumo.tensao}%0A*LOCAL/EMPRESA:* ${resumo.empresa}%0A*SOLICITANTE:* ${resumo.contato}%0A*PRIORIDADE:* ${resumo.urgencia === 'critica' ? 'EMERGÊNCIA (MÁQUINA PARADA)' : 'NORMAL'}`;
    return `https://wa.me/5519983808498?text=${textoZap}`;
  };

  return (
    <div className="min-h-screen bg-[#05080a] text-white flex flex-col lumimotion-grid">
      {/* Top Cyber Assistant Header */}
      <header className="sticky top-0 z-30 border-b border-[#232d42]/80 bg-[#0a0e17]/95 backdrop-blur-xl">
        <div className="w-full max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          {/* Back & Assistant Status */}
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="p-2 rounded-xl bg-[#121824] border border-[#232d42] text-slate-300 hover:text-white transition-all flex items-center justify-center"
              title="Voltar ao Painel"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-[#131a29] border border-[#2b3952] flex items-center justify-center shadow-[0_0_15px_rgba(252,220,93,0.15)]">
                  <Zap className="w-5 h-5 text-[#fcdc5d]" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0a0e17] shadow-[0_0_8px_rgba(52,211,153,0.9)] animate-pulse"></span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h1 className="text-sm sm:text-base font-bold font-outfit text-white">
                    Engenheiro Faísca
                  </h1>
                  <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-[#fcdc5d]/10 text-[#fcdc5d] border border-[#fcdc5d]/30">
                    IA 24h
                  </span>
                </div>
                <p className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                  <span>TecManutenções Industrial • Online</span>
                </p>
              </div>
            </div>
          </div>

          {/* Plantão WhatsApp CTA */}
          <a
            href="https://wa.me/5519983808498"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all active:scale-95"
          >
            <Phone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Plantão WhatsApp</span>
            <span className="sm:hidden">Plantão</span>
          </a>
        </div>
      </header>

      {/* Main Chat Stream Container */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6 flex flex-col justify-between">
        {/* Messages Stream */}
        <div className="space-y-4 pb-4">
          {mensagens.map((msg) => {
            const isIA = msg.remetente === 'ia';
            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 sm:gap-3.5 max-w-2xl ${
                  isIA ? 'mr-auto' : 'ml-auto flex-row-reverse'
                } animate-in fade-in slide-in-from-bottom-2 duration-300`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-md ${
                    isIA
                      ? 'bg-[#121826] border border-[#26334d] text-[#fcdc5d]'
                      : 'bg-[#fcdc5d] text-[#0a0d14] font-bold'
                  }`}
                >
                  {isIA ? <Zap className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                {/* Message Box */}
                <div className="space-y-2.5 flex-1">
                  <div
                    className={`rounded-2xl p-3.5 sm:p-4 text-xs sm:text-sm leading-relaxed shadow-lg ${
                      isIA
                        ? 'bg-gradient-to-b from-[#111724] to-[#0d121c] border border-[#232d42] text-slate-100'
                        : 'bg-gradient-to-r from-[#fcdc5d] to-[#f7ce3e] text-[#0a0d14] font-semibold border border-[#fcdc5d]'
                    }`}
                  >
                    <div className="whitespace-pre-line">{msg.texto}</div>
                  </div>

                  {/* Diagnostic Summary Card upon completion */}
                  {msg.resumoPedido && (
                    <div className="lumimotion-card rounded-2xl p-4 sm:p-5 border-emerald-500/40 space-y-3 shadow-[0_0_25px_rgba(52,211,153,0.1)]">
                      <div className="flex items-center justify-between pb-2 border-b border-[#232d42]">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span className="text-xs font-bold text-white uppercase tracking-wider">
                            Resumo do Diagnóstico Técnico
                          </span>
                        </div>
                        <span className="text-xs font-mono font-bold text-[#fcdc5d]">
                          {msg.resumoPedido.protocolo}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                        <p>
                          <strong className="text-slate-400 font-medium">Serviço:</strong>{' '}
                          {msg.resumoPedido.servico}
                        </p>
                        <p>
                          <strong className="text-slate-400 font-medium">Equipamento:</strong>{' '}
                          {msg.resumoPedido.maquina}
                        </p>
                        <p>
                          <strong className="text-slate-400 font-medium">Tensão:</strong>{' '}
                          {msg.resumoPedido.tensao}
                        </p>
                        <p>
                          <strong className="text-slate-400 font-medium">Solicitante:</strong>{' '}
                          {msg.resumoPedido.contato}
                        </p>
                      </div>

                      {/* WhatsApp Dispatch Button */}
                      <a
                        href={getWhatsAppLink(msg.resumoPedido)}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full mt-2 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 active:scale-98 transition-all"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>Falar Imediatamente com Engenheiro no WhatsApp</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}

                  {/* Quick Response Action Chips (Horizontal scroll on mobile) */}
                  {msg.opcoesRapidas && msg.opcoesRapidas.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {msg.opcoesRapidas.map((opcao, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleOpcaoRapida(opcao.valor)}
                          className="px-3.5 py-2 rounded-xl bg-[#121927] hover:bg-[#1c273c] border border-[#232d42] hover:border-[#fcdc5d]/50 text-xs font-semibold text-slate-200 hover:text-white transition-all shadow-sm flex items-center gap-1.5 active:scale-95 text-left"
                        >
                          <span>{opcao.rotulo}</span>
                          <ChevronRight className="w-3 h-3 text-slate-500" />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Timestamp */}
                  <div
                    className={`text-[10px] text-slate-500 ${
                      isIA ? 'text-left' : 'text-right'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator Animation */}
          {isDigitando && (
            <div className="flex gap-3 items-center mr-auto">
              <div className="w-8 h-8 rounded-xl bg-[#121826] border border-[#26334d] text-[#fcdc5d] flex items-center justify-center">
                <Zap className="w-4 h-4" />
              </div>
              <div className="rounded-2xl px-4 py-3 bg-[#111724] border border-[#232d42] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#fcdc5d] animate-bounce"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#fcdc5d] animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#fcdc5d] animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Bottom Input Field Container */}
        <div className="sticky bottom-2 z-20 pt-2">
          <form
            onSubmit={handleEnviar}
            className="flex items-center gap-2 p-1.5 sm:p-2 rounded-2xl lumimotion-card shadow-2xl"
          >
            <input
              type="text"
              value={inputTexto}
              onChange={(e) => setInputTexto(e.target.value)}
              placeholder="Digite sua resposta técnica ou dúvida..."
              className="flex-1 px-3 sm:px-4 py-2.5 bg-transparent text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none"
            />

            <button
              type="submit"
              disabled={!inputTexto.trim()}
              className="p-2.5 sm:px-4 sm:py-2.5 rounded-xl bg-[#fcdc5d] hover:bg-[#f5cb3c] disabled:opacity-40 text-[#0a0d14] font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow-md shadow-[#fcdc5d]/20 active:scale-95 cursor-pointer shrink-0"
              aria-label="Enviar Mensagem"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Enviar</span>
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
