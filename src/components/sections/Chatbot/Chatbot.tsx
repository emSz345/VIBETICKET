import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Chatbot.css";
import { FaComments, FaTimes, FaMicrophone, FaPaperPlane } from "react-icons/fa";
import { BsEmojiSmile } from "react-icons/bs";
import axios from "axios";

import logoChatBot from "../../../assets/logo-chatbot.png";
import logoChatBot1 from "../../../assets/logo-chatBot-with.png";

interface Evento {
  _id: string;
  nome: string;
  imagem: string;
  categoria: string;
  descricao: string;
  dataInicio: string;
  horaInicio: string;
  cidade: string;
  estado: string;
  valorIngressoInteira?: number;
}

interface FiltroEstado {
  categoria?: string;
  waitingForFilter?: string;
  quantidade?: number;
  tipoIngresso?: string;
  faixaPreco?: { min: number; max: number };
  localizacao?: string;
  dataPreferencia?: string;
}

interface Mensagem {
  from: "user" | "bot";
  text: string;
  intent?: string;
  confidence?: number;
  eventos?: Evento[];
  categorias?: string[];
  localizacao?: string;
  showCommands?: boolean;
  state?: FiltroEstado;
}

interface CategoriasListaProps {
  categorias: string[];
  onCategoriaClick: (categoria: string) => void;
}

interface ComandoRapido {
  texto: string;
  acao: string;
  icone: string;
  tipo: 'evento' | 'ajuda' | 'sistema' | 'social';
}

const ComandosRapidos: React.FC<{ onComandoClick: (comando: string) => void }> = ({ onComandoClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const comandos: ComandoRapido[] = [
    // SAUDAÇÕES E SOCIAIS
    { texto: "Dizer olá", acao: "Oi, tudo bem?", icone: "👋", tipo: 'social' },
    { texto: "Agradecer", acao: "Obrigado!", icone: "🙏", tipo: 'social' },

    // AJUDA DO SISTEMA
    { texto: "Como usar?", acao: "Como funciona?", icone: "❓", tipo: 'ajuda' },
    { texto: "Sobre", acao: "Quem é você?", icone: "🎪", tipo: 'sistema' },
    { texto: "Comprar ingresso", acao: "Como comprar ingressos?", icone: "🎫", tipo: 'evento' },
    { texto: "Meu carrinho", acao: "Como funciona o carrinho?", icone: "🛒", tipo: 'evento' },
    { texto: "Criar evento", acao: "Como criar um evento?", icone: "🎪", tipo: 'evento' },
    { texto: "Meu perfil", acao: "Como editar meu perfil?", icone: "👤", tipo: 'sistema' },

    // EVENTOS (mantenha apenas os essenciais)
    { texto: "Rock", acao: "Eventos de rock", icone: "🎸", tipo: 'evento' },
    { texto: "São Paulo", acao: "Eventos em SP", icone: "🏙️", tipo: 'evento' },
    { texto: "Próximos", acao: "Próximos eventos", icone: "📅", tipo: 'evento' },
    { texto: "Categorias", acao: "Quais categorias?", icone: "🎵", tipo: 'evento' }
  ];

  // Comandos principais (sempre visíveis)
  const comandosPrincipais = comandos.slice(0, 4);
  // Comandos secundários (expandíveis)
  const comandosSecundarios = comandos.slice(4);

  return (
    <div className="comandos-rapidos">
      <div className="comandos-titulo">💡 Comandos rápidos</div>

      {/* Comandos principais */}
      <div className="comandos-grid">
        {comandosPrincipais.map((comando, index) => (
          <button
            key={index}
            className="comando-btn"
            onClick={() => onComandoClick(comando.acao)}
            title={comando.acao}
            data-tipo={comando.tipo}
          >
            <span className="comando-icone">{comando.icone}</span>
            {comando.texto}
          </button>
        ))}
      </div>

      {/* Comandos expandíveis */}
      {isExpanded && (
        <>
          <div className="comandos-grid">
            {comandosSecundarios.map((comando, index) => (
              <button
                key={index}
                className="comando-btn"
                onClick={() => onComandoClick(comando.acao)}
                title={comando.acao}
                data-tipo={comando.tipo}
              >
                <span className="comando-icone">{comando.icone}</span>
                {comando.texto}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Botão toggle */}
      <button
        className="comandos-toggle"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? '▲ Menos opções' : '▼ Mais opções'}
      </button>
    </div>
  );
};

const CategoriasLista: React.FC<CategoriasListaProps> = ({
  categorias,
  onCategoriaClick
}) => {
  if (!categorias || categorias.length === 0) return null;

  return (
    <div className="categorias-lista">
      <div className="categorias-titulo">🎵 Categorias disponíveis:</div>
      <div className="categorias-grid">
        {categorias.map((categoria, index) => (
          <button
            key={index}
            className="categoria-btn"
            onClick={() => onCategoriaClick(categoria)}
          >
            {categoria}
          </button>
        ))}
      </div>
    </div>
  );
};

const ChatBot: React.FC = () => {
  const [isEnabled, setIsEnabled] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState<FiltroEstado>({});
  const [showCommands, setShowCommands] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [showBalloon, setShowBalloon] = useState(true);
  const [messages, setMessages] = useState<Mensagem[]>([
    {
      from: "bot",
      text: "E aí! 👋 Bora subir essa vibe hoje? Sou o Vibe Bot e posso te ajudar a encontrar os melhores eventos! 🎵",
      eventos: []
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Gerar ID único para o usuário
  const userId = useRef('user-' + Math.random().toString(36).substr(2, 9));

  // Função para remover conteúdo de pensamento interno
  // Função para remover conteúdo de pensamento interno
  // Função para remover conteúdo duplicado e pensamento interno
  // Função mais agressiva para limpar respostas duplicadas
  const limparRespostaBot = (texto: string): string => {
    if (!texto) return texto;

    let limpo = texto;

    // Remove qualquer tag <think>...</think> ou </think>
    limpo = limpo.replace(/<\/?think[^>]*>/gi, '');

    // Remove linhas com raciocínio
    limpo = limpo.replace(/^(Racioc[ií]nio|Pensamento|Thought|Reasoning).*$/gim, '');

    // Remove qualquer sobra depois de <think ou reasoning
    const idx = limpo.search(/<think|<\/think>|reasoning|pensamento|thought/i);
    if (idx !== -1) {
      limpo = limpo.substring(0, idx);
    }

    return limpo.trim();
  };


  // Calcular similaridade entre duas strings


  // Auto-scroll quando mensagens mudam
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen && isEnabled && messages.length <= 2) {
      const timer = setTimeout(() => {
        setShowCommands(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, messages.length, isEnabled]);

  // Balão reaparece a cada 1 minuto e dura 5s
  useEffect(() => {
    if (!isOpen && isEnabled) {
      const showBalloonNow = () => {
        setShowBalloon(true);
        setTimeout(() => setShowBalloon(false), 5000);
      };

      showBalloonNow();

      const interval = setInterval(showBalloonNow, 60000);

      return () => clearInterval(interval);
    }
  }, [isOpen, isEnabled]);

  const toggleChat = () => {
    if (!isEnabled) return;
    setIsOpen(!isOpen);
    if (!isOpen) setShowBalloon(false);
  };

  // Função para buscar eventos com filtros
  const buscarEventosComFiltros = async (filtros: FiltroEstado): Promise<Evento[]> => {
    try {
      const response = await axios.post('http://localhost:5000/api/huggingface/chat', {
        message: `Buscar eventos de ${filtros.categoria} com filtros`,
        state: filtros
      }, {
        headers: {
          'User-ID': userId.current
        }
      });

      return response.data.eventos || [];
    } catch (error) {
      console.error("Erro ao buscar eventos com filtros:", error);
      return [];
    }
  };

  // Função auxiliar para determinar o conteúdo da mensagem
  const getMessageContent = (msg: Mensagem) => {
    // Prioridade 1: Eventos encontrados
    if (msg.eventos && msg.eventos.length > 0) {
      return {
        showText: true,
        showEvents: true,
        showCategories: false,
        showNoResults: false
      };
    }

    // Prioridade 2: Categorias (apenas quando não há eventos)
    if (msg.categorias && msg.categorias.length > 0) {
      return {
        showText: true,
        showEvents: false,
        showCategories: true,
        showNoResults: false
      };
    }

    // Prioridade 3: Sem resultados para busca de eventos
    if (msg.intent?.includes('evento')) {
      return {
        showText: true,
        showEvents: false,
        showCategories: false,
        showNoResults: true
      };
    }

    // Padrão: mostrar apenas texto
    return {
      showText: true,
      showEvents: false,
      showCategories: false,
      showNoResults: false
    };
  };

  interface HuggingFaceResponse {
    success: boolean;
    reply: {
      text: string;
      intent?: string;
      confidence?: number;
      eventos?: Evento[];
      categorias?: string[];
      showCommands?: boolean;
      state?: FiltroEstado;
    };
    categorias?: string[];
  }

  const sendMessage = async (messageText?: string) => {
    if (!isEnabled) return;

    const textToSend = messageText || inputValue;
    if (!textToSend.trim()) return;

    const newMessage: Mensagem = {
      from: "user",
      text: textToSend,
      eventos: [],
      state: filtroEstado
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue("");
    setIsTyping(true);
    setShowCommands(false);

    try {
      const response = await axios.post('http://localhost:5000/api/huggingface/chat', {
        message: textToSend,
        state: filtroEstado
      }, {
        headers: {
          'User-ID': userId.current
        }
      });

      const responseData: HuggingFaceResponse = response.data;

      if (responseData.success) {
        const botReply = responseData.reply;

        // LIMPAR A RESPOSTA DO BOT
        const textoLimpo = limparRespostaBot(botReply.text || "");

        const botMessage: Mensagem = {
          from: "bot",
          text: textoLimpo,
          intent: botReply.intent,
          confidence: botReply.confidence,
          eventos: botReply.eventos || [],
          categorias: botReply.categorias || [],
          showCommands: botReply.showCommands,
          state: botReply.state,
        };

        // Atualizar estado do filtro se fornecido
        if (botReply.state) {
          setFiltroEstado(botReply.state);
        }

        setMessages(prev => [...prev, botMessage]);
        setShowCommands(botReply.showCommands || false);

        // Atualizar categorias se for o caso
        if (responseData.categorias && responseData.categorias.length > 0) {
          setCategorias(responseData.categorias);
        }
      } else {
        // Tratar erro da API
        const errorMessage: Mensagem = {
          from: "bot",
          text: "Desculpe, tive um problema ao processar sua mensagem. Podemos tentar novamente?",
          showCommands: true
        };
        setMessages(prev => [...prev, errorMessage]);
        setShowCommands(true);
      }
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      const errorMessage: Mensagem = {
        from: "bot",
        text: "Estou com dificuldades técnicas. Tente novamente em instantes! 🛠️",
        showCommands: true
      };
      setMessages(prev => [...prev, errorMessage]);
      setShowCommands(true);
    } finally {
      setIsTyping(false);
    }
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const EventosLista: React.FC<{ eventos: Evento[] }> = ({ eventos }) => {
    if (!eventos || eventos.length === 0) return null;

    const abrirDetalhesEvento = (eventoId: string) => {
      window.open(`/evento/${eventoId}`, '_blank');
    };

    return (
      <div className="chatbot-eventos-lista">
        <div className="chatbot-eventos-titulo">🎪 Eventos encontrados:</div>
        {eventos.map((evento) => (
          <div
            key={evento._id}
            className="chatbot-evento-card"
            onClick={() => abrirDetalhesEvento(evento._id)}
            title="Clique para ver detalhes do evento"
          >
            <div className="chatbot-evento-nome">{evento.nome}</div>
            <div className="chatbot-evento-info">
              📅 {formatarData(evento.dataInicio)} às {evento.horaInicio}
            </div>
            <div className="chatbot-evento-info">
              📍 {evento.cidade} - {evento.estado}
            </div>
            <div className="chatbot-evento-info">
              🎵 {evento.categoria}
            </div>
            {evento.valorIngressoInteira && evento.valorIngressoInteira > 0 && (
              <div className="chatbot-evento-preco">
                💰 R$ {evento.valorIngressoInteira.toFixed(2)}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Balão de mensagem acima do botão */}
      {!isOpen && showBalloon && isEnabled && (
        <div className="chatbot-message-floating">
          Tem alguma dúvida? <br /> Vem conhecer a Vibe Bot!!!
          <span className="chatbot-arrow"></span>
        </div>
      )}

      {/* Botão Flutuante */}
      <motion.button
        className="chatbot-button"
        onClick={toggleChat}
        whileHover={isEnabled ? { scale: 1.1 } : {}}
        whileTap={isEnabled ? { scale: 0.95 } : {}}
        aria-label={isEnabled ? "Abrir chat" : "Chat desabilitado"}
        style={{ opacity: isEnabled ? 1 : 0.5 }}
      >
        {isOpen ? <FaTimes /> : <img src={logoChatBot} title="Foto Chatbot" style={{ height: "55px", width: "55px" }} />}
        {!isOpen && isEnabled && (
          <motion.span
            className="pulse-dot"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
        )}
      </motion.button>

      {/* Janela do Chat */}
      <AnimatePresence>
        {isOpen && isEnabled && (
          <motion.div
            className="chatbot-container"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
          >
            <div className="chatbot-header">
              <div className="chatbot-avatar">
                <img src={logoChatBot1} alt="Vibe Bot" style={{ width: "46px", height: "46px", borderRadius: "50%" }} />
              </div>
              <div className="chatbot-header-info">
                <span>Vibe Bot</span>
                <small>{isTyping ? "Digitando..." : "Online"}</small>
              </div>
            </div>

            <div className="chatbot-messages">
              {messages.map((msg, index) => {
                const content = getMessageContent(msg);

                return (
                  <motion.div
                    key={index}
                    className={`chatbot-message ${msg.from === "bot" ? "bot" : "user"}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Texto da mensagem */}
                    {content.showText && (
                      <div className="message-text-content">
                        {msg.text.split('\n').map((line, i) => (
                          <React.Fragment key={i}>
                            {line}
                            {i < msg.text.split('\n').length - 1 && <br />}
                          </React.Fragment>
                        ))}
                      </div>
                    )}

                    {/* Eventos encontrados */}
                    {content.showEvents && msg.eventos && msg.eventos.length > 0 && (
                      <EventosLista eventos={msg.eventos} />
                    )}

                    {/* Categorias disponíveis */}
                    {content.showCategories && msg.categorias && msg.categorias.length > 0 && (
                      <CategoriasLista
                        categorias={msg.categorias}
                        onCategoriaClick={(categoria) => {
                          setInputValue(categoria);
                          sendMessage(categoria);
                        }}
                      />
                    )}

                    {/* Mensagem de "sem resultados" */}
                    {content.showNoResults && (
                      <div className="navibe-evento-sem-resultado">
                        {msg.localizacao ? (
                          <>
                            📍 Não encontrei eventos em <strong>{msg.localizacao.toUpperCase()}</strong> no momento.
                            <br />
                            🎵 Que tal buscar por <strong>categoria</strong> ou <strong>outra cidade</strong>?
                          </>
                        ) : (
                          <>
                            🔍 Não encontrei eventos com esses filtros.
                            <br />
                            🎪 Experimente buscar por <strong>cidade</strong>, <strong>categoria</strong> ou ver todos os eventos!
                          </>
                        )}

                        <div className="navibe-sugestoes-busca">
                          <span className="navibe-sugestao-titulo">💡 Sugestões:</span>
                          <button
                            className="navibe-sugestao-btn"
                            onClick={() => setInputValue("Eventos de rock")}
                          >
                            🎸 Rock
                          </button>
                          <button
                            className="navibe-sugestao-btn"
                            onClick={() => setInputValue("Eventos em Rio de Janeiro")}
                          >
                            🌆 Rio de Janeiro
                          </button>
                          <button
                            className="navibe-sugestao-btn"
                            onClick={() => setInputValue("Próximos eventos")}
                          >
                            📅 Todos os eventos
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
              {isTyping && (
                <motion.div
                  className="chatbot-message bot typing-indicator"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {showCommands && (
              <ComandosRapidos onComandoClick={sendMessage} />
            )}

            <div className="chatbot-input">
              <input
                type="text"
                placeholder="Digite sua mensagem..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                className="send-button"
                onClick={() => sendMessage()}
                disabled={!inputValue.trim()}
              >
                <FaPaperPlane />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;