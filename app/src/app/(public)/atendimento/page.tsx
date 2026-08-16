'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { 
  Wrench, Send, Bot, User, ShieldAlert, CheckCircle2, 
  Sparkles, Clock, ArrowLeft, Phone, Factory, Cpu, Zap, Shield, AlertTriangle
} from 'lucide-react';

interface MensagemChat {
  id: string;
  remetente: 'ia' | 'usuario';
  texto: string;
  timestamp: string;
  opcoesRapidas?: { rotulo: string; valor: string; icone?: any }[];
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
      texto: 'Olá! Sou o **Faísca**, Engenheiro Assistente da **TecManutenções** ⚡\n\nEstou aqui para entender o seu caso técnico e agilizar o seu orçamento ou atendimento de emergência. Qual é a sua necessidade principal hoje?',
      timestamp: 'Agora',
      opcoesRapidas: [
        { rotulo: '🚨 Máquina Parada / Emergência', valor: 'Emergência: Linha/Máquina Parada' },
        { rotulo: '🛡️ Adequação NR-12 Turnkey', valor: 'Adequação NR-12 com ART' },
        { rotulo: '⚡ Automação & Retrofit', valor: 'Automação & Retrofit de Máquinas' },
        { rotulo: '🏭 Parada Programada / QGBT', valor: 'Parada Programada de Manutenção' },
        { rotulo: '📋 Contrato Mensal / Preventiva', valor: 'Contrato de Manutenção Preventiva' },
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  const responderIA = (respostaTexto: string, opcoes?: { rotulo: string; valor: string }[], resumo?: any) => {
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
    }, 900);
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
      // Coletou o tipo de serviço
      const isEmergencia = texto.toLowerCase().includes('emergência') || texto.toLowerCase().includes('parada');
      setDadosColetados((prev) => ({
        ...prev,
        servico: texto,
        urgencia: isEmergencia ? 'critica' : 'normal',
      }));
      setEtapa(2);

      responderIA(
        isEmergencia
          ? '⚠️ **Entendido! Caso de alta prioridade.** Qual é o equipamento ou máquina que está apresentando a falha (ex: Prensa, Extrusora, Ponte Rolante, Painel QGBT)?'
          : 'Excelente. Qual é o equipamento, máquina ou setor industrial envolvido nesse projeto?',
        [
          { rotulo: 'Prensa Hidráulica / Excêntrica', valor: 'Prensa Hidráulica / Excêntrica' },
          { rotulo: 'Ponte Rolante / Talha', valor: 'Ponte Rolante / Talha' },
          { rotulo: 'Painel Elétrico / QGBT', valor: 'Painel Elétrico / Subestação / QGBT' },
          { rotulo: 'Linha de Envase / Produção', valor: 'Linha de Envase / Produção Contínua' },
          { rotulo: 'Outro Equipamento', valor: 'Outro Equipamento Fabril' },
        ]
      );
    } else if (etapa === 2) {
      // Coletou o equipamento
      setDadosColetados((prev) => ({ ...prev, maquina: texto }));
      setEtapa(3);

      responderIA(
        'Perfeito. Qual é o nível de tensão elétrica da sua fábrica e qual o principal sintoma ou escopo desejado?',
        [
          { rotulo: '220V Trifásico', valor: '220V Trifásico' },
          { rotulo: '380V Trifásico', valor: '380V Trifásico' },
          { rotulo: '440V Industrial', valor: '440V Industrial' },
          { rotulo: 'Média Tensão / Cabine', valor: 'Média Tensão / Cabine Primária' },
        ]
      );
    } else if (etapa === 3) {
      // Coletou tensão / sintomas
      setDadosColetados((prev) => ({ ...prev, tensao: texto, sintomas: texto }));
      setEtapa(4);

      responderIA(
        'Anotado! Agora, para registrarmos o chamado técnico no painel e enviarmos um especialista, qual o **Nome da sua Empresa** e a **Cidade** onde fica a fábrica?'
      );
    } else if (etapa === 4) {
      // Coletou empresa e cidade
      setDadosColetados((prev) => ({ ...prev, empresa: texto, cidade: texto }));
      setEtapa(5);

      responderIA(
        'Ótimo! Por favor, qual é o seu **Nome Completo** e o **WhatsApp com DDD** para contato imediato do nosso time de engenharia?'
      );
    } else if (etapa === 5) {
      // Coletou nome e WhatsApp -> Finalizar e salvar no Supabase!
      const contatoInfo = texto;
      const novoDados = {
        ...dadosColetados,
        contato_nome: contatoInfo,
        whatsapp: contatoInfo,
      };
      setDadosColetados(novoDados);
      setEtapa(6);

      const protocolo = `TEC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

      // Salva no backend
      try {
        await fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nome: novoDados.contato_nome || 'Cliente Chat IA',
            empresa: novoDados.empresa || 'Empresa Informada no Chat',
            telefone: novoDados.whatsapp || '',
            origem: 'chat_ia_faisca',
            categoria: novoDados.urgencia === 'critica' ? 'urgente' : 'industrial',
            descricao_problema: `[Atendimento IA] Serviço: ${novoDados.servico} | Equipamento: ${novoDados.maquina} | Tensão: ${novoDados.tensao} | Local: ${novoDados.empresa}`,
          }),
        });
      } catch (err) {
        console.error('Erro ao registrar lead:', err);
      }

      responderIA(
        `✅ **Pedido Técnico Registrado com Sucesso!**\n\nNosso time técnico e os engenheiros responsáveis já foram notificados em tempo real no painel.\n\nVocê também pode iniciar uma conversa direta no WhatsApp agora mesmo com o resumo técnico já preenchido:`,
        undefined,
        {
          protocolo,
          servico: novoDados.servico,
          maquina: novoDados.maquina,
          tensao: novoDados.tensao,
          empresa: novoDados.empresa,
          cidade: novoDados.cidade,
          contato: novoDados.contato_nome,
          whatsapp: novoDados.whatsapp,
          urgencia: novoDados.urgencia,
        }
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0d14] text-[#f8fafc] flex flex-col">
      {/* Header do Chat */}
      <header className="border-b border-[#232b3e] bg-[#111622] sticky top-0 z-30 shadow-md">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-xl bg-[#161c2c] hover:bg-[#1f283d] border border-[#232b3e] text-[#94a3b8] hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-[#fcdc5d]/10 border border-[#fcdc5d]/30 flex items-center justify-center text-[#fcdc5d]">
                <Bot className="w-5 h-5" />
              </div>
              <span className="w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#111622] absolute bottom-0 right-0"></span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold font-outfit text-white">Faísca IA</h1>
                <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Online
                </span>
              </div>
              <p className="text-[11px] text-[#94a3b8]">Especialista Técnico TecManutenções</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-[#161c2c] hover:bg-[#1f283d] border border-[#232b3e] text-[#94a3b8] hover:text-white"
            >
              Área do Sócio
            </Link>
          </div>
        </div>
      </header>

      {/* Corpo do Chat */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 flex flex-col justify-between">
        {/* Mensagens */}
        <div className="space-y-4 pb-4 overflow-y-auto">
          {mensagens.map((msg) => {
            const isIA = msg.remetente === 'ia';

            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isIA ? 'justify-start' : 'justify-end'}`}
              >
                {isIA && (
                  <div className="w-8 h-8 rounded-full bg-[#fcdc5d]/10 border border-[#fcdc5d]/30 flex items-center justify-center text-[#fcdc5d] shrink-0 mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-[85%] sm:max-w-[75%] space-y-3`}>
                  <div
                    className={`rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-lg ${
                      isIA
                        ? 'bg-[#161c2c] border border-[#232b3e] text-white rounded-tl-sm'
                        : 'bg-[#fcdc5d] text-[#0a0d14] font-medium rounded-tr-sm'
                    }`}
                  >
                    <div className="whitespace-pre-line">{msg.texto}</div>
                    <span
                      className={`text-[10px] block mt-1.5 text-right font-mono ${
                        isIA ? 'text-[#94a3b8]' : 'text-[#0a0d14]/70'
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>

                  {/* Resumo do Pedido / Card de Conclusão */}
                  {msg.resumoPedido && (
                    <div className="bg-[#111622] rounded-2xl p-5 border border-emerald-500/40 shadow-xl space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-[#232b3e]">
                        <span className="text-[10px] font-mono uppercase text-[#94a3b8]">
                          Protocolo de Atendimento
                        </span>
                        <span className="text-xs font-bold font-mono text-emerald-400">
                          #{msg.resumoPedido.protocolo}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-[#94a3b8]">Serviço:</span>
                          <p className="font-bold text-white">{msg.resumoPedido.servico}</p>
                        </div>
                        <div>
                          <span className="text-[#94a3b8]">Equipamento:</span>
                          <p className="font-bold text-white">{msg.resumoPedido.maquina}</p>
                        </div>
                        <div>
                          <span className="text-[#94a3b8]">Local / Empresa:</span>
                          <p className="font-bold text-white">{msg.resumoPedido.empresa}</p>
                        </div>
                        <div>
                          <span className="text-[#94a3b8]">Status:</span>
                          <p className="font-bold text-emerald-400">Em Análise Técnica Imediata</p>
                        </div>
                      </div>

                      <a
                        href={`https://wa.me/5519983808498?text=${encodeURIComponent(
                          `Olá TecManutenções! Acabei de abrir o chamado técnico ${msg.resumoPedido.protocolo} no chat IA.\n\n*Serviço:* ${msg.resumoPedido.servico}\n*Equipamento:* ${msg.resumoPedido.maquina}\n*Local:* ${msg.resumoPedido.empresa}\n*Contato:* ${msg.resumoPedido.contato}`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full mt-2 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#0a0d14] font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/20"
                      >
                        <Phone className="w-4 h-4" />
                        <span>Falar Direto no WhatsApp da Engenharia</span>
                      </a>
                    </div>
                  )}

                  {/* Botões de Opções Rápidas */}
                  {msg.opcoesRapidas && msg.opcoesRapidas.length > 0 && etapa < 6 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {msg.opcoesRapidas.map((opcao, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleOpcaoRapida(opcao.valor)}
                          className="text-xs font-semibold px-3.5 py-2 rounded-xl bg-[#111622] hover:bg-[#fcdc5d] text-[#94a3b8] hover:text-[#0a0d14] border border-[#232b3e] hover:border-[#fcdc5d] transition-all transform active:scale-95 shadow-sm"
                        >
                          {opcao.rotulo}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {!isIA && (
                  <div className="w-8 h-8 rounded-full bg-[#161c2c] border border-[#232b3e] flex items-center justify-center text-white shrink-0 mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isDigitando && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#fcdc5d]/10 border border-[#fcdc5d]/30 flex items-center justify-center text-[#fcdc5d] shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-[#161c2c] border border-[#232b3e] px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#fcdc5d] animate-bounce"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#fcdc5d] animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#fcdc5d] animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleEnviar} className="mt-4 pt-3 border-t border-[#232b3e] flex gap-2">
          <input
            type="text"
            value={inputTexto}
            onChange={(e) => setInputTexto(e.target.value)}
            placeholder={
              etapa === 6
                ? 'Chamado finalizado. Deseja enviar mais alguma informação?'
                : 'Digite sua mensagem ou escolha uma opção acima...'
            }
            className="flex-1 bg-[#161c2c] border border-[#232b3e] rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-[#94a3b8] focus:outline-none focus:border-[#fcdc5d] transition-all"
          />
          <button
            type="submit"
            disabled={!inputTexto.trim()}
            className="px-5 bg-[#fcdc5d] hover:bg-[#f5cb3c] disabled:opacity-40 text-[#0a0d14] font-bold rounded-xl flex items-center justify-center transition-all shadow-md active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </main>
    </div>
  );
}
