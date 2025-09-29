import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Chatbot.css";
import { useNavigate } from "react-router-dom";
import { FaTimes, FaPaperPlane } from "react-icons/fa";

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

interface CarrinhoItem {
  id: string;
  nomeEvento: string;
  imagem: string;
  dataEvento: string;
  localEvento: string;
  tipoIngresso: string;
  preco: number;
  quantidade: number;
}

interface QuickReply {
  text: string;
  action: string;
  itemId?: string;
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
  quickReplies?: QuickReply[];
  carrinho?: CarrinhoItem[];
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
    { texto: "Dizer olá", acao: "Oi, tudo bem?", icone: "👋", tipo: 'social' },
    { texto: "Agradecer", acao: "Obrigado!", icone: "🙏", tipo: 'social' },
    { texto: "Como usar?", acao: "Como funciona?", icone: "❓", tipo: 'ajuda' },
    { texto: "Sobre", acao: "Quem é você?", icone: "🎪", tipo: 'sistema' },
    { texto: "Comprar ingresso", acao: "Como comprar ingressos?", icone: "🎫", tipo: 'evento' },
    { texto: "Meu carrinho", acao: "Ver meu carrinho", icone: "🛒", tipo: 'evento' },
    { texto: "Finalizar compra", acao: "Quero finalizar a compra", icone: "✅", tipo: 'evento' },
    { texto: "Limpar carrinho", acao: "Limpar carrinho", icone: "🧹", tipo: 'evento' },
    { texto: "Criar evento", acao: "Como criar um evento?", icone: "🎪", tipo: 'evento' },
    { texto: "Meu perfil", acao: "Como editar meu perfil?", icone: "👤", tipo: 'sistema' },
    { texto: "Rock", acao: "Eventos de rock", icone: "🎸", tipo: 'evento' },
    { texto: "São Paulo", acao: "Eventos em SP", icone: "🏙️", tipo: 'evento' },
    { texto: "Próximos", acao: "Próximos eventos", icone: "📅", tipo: 'evento' },
    { texto: "Categorias", acao: "Quais categorias?", icone: "🎵", tipo: 'evento' }
  ];

  const comandosPrincipais = comandos.slice(0, 4);
  const comandosSecundarios = comandos.slice(4);

  return (
    <div className="comandos-rapidos">
      <div className="comandos-titulo">💡 Comandos rápidos</div>
      <div className="comandos-grid">
        {comandosPrincipais.map((comando, index) => (
          <button
            key={index}
            className="comando-btn"
            onClick={() => onComandoClick(comando.acao)}
            data-tipo={comando.tipo}
          >
            <span className="comando-icone">{comando.icone}</span>
            {comando.texto}
          </button>
        ))}
      </div>

      {isExpanded && (
        <div className="comandos-grid">
          {comandosSecundarios.map((comando, index) => (
            <button
              key={index}
              className="comando-btn"
              onClick={() => onComandoClick(comando.acao)}
              data-tipo={comando.tipo}
            >
              <span className="comando-icone">{comando.icone}</span>
              {comando.texto}
            </button>
          ))}
        </div>
      )}

      <button
        className="comandos-toggle"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? '▲ Menos opções' : '▼ Mais opções'}
      </button>
    </div>
  );
};

const CategoriasLista: React.FC<CategoriasListaProps> = ({ categorias, onCategoriaClick }) => {
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

const QuickReplies: React.FC<{ 
  quickReplies: QuickReply[]; 
  onQuickReplyClick: (action: string, itemId?: string) => void 
}> = ({ quickReplies, onQuickReplyClick }) => {
  if (!quickReplies || quickReplies.length === 0) return null;

  return (
    <div className="quick-replies">
      <div className="quick-replies-titulo">💡 Ações rápidas:</div>
      <div className="quick-replies-grid">
        {quickReplies.map((qr, index) => (
          <button
            key={index}
            className="quick-reply-btn"
            onClick={() => onQuickReplyClick(qr.action, qr.itemId)}
            data-action={qr.action}
          >
            {qr.text}
          </button>
        ))}
      </div>
    </div>
  );
};

const CarrinhoLista: React.FC<{ 
  carrinho: CarrinhoItem[];
  onRemoverItem: (id: string) => void;
  onLimparCarrinho: () => void;
  onFinalizarCompra: () => void;
}> = ({ carrinho, onRemoverItem, onLimparCarrinho, onFinalizarCompra }) => {
  if (!carrinho || carrinho.length === 0) return null;

  const total = carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);

  return (
    <div className="carrinho-lista">
      <div className="carrinho-titulo">🛒 Seu Carrinho</div>
      {carrinho.map((item, index) => (
        <div key={item.id} className="carrinho-item">
          <div className="carrinho-item-info">
            <div className="carrinho-item-nome">{item.nomeEvento}</div>
            <div className="carrinho-item-detalhes">
              <span>📅 {item.dataEvento}</span>
              <span>📍 {item.localEvento}</span>
              <span>🎫 {item.quantidade}x R$ {item.preco.toFixed(2)}</span>
              <span>💰 Subtotal: R$ {(item.preco * item.quantidade).toFixed(2)}</span>
            </div>
          </div>
          <button
            className="carrinho-item-remover"
            onClick={() => onRemoverItem(item.id)}
            aria-label="Remover item"
          >
            🗑️
          </button>
        </div>
      ))}
      <div className="carrinho-total">
        <strong>💰 TOTAL: R$ {total.toFixed(2)}</strong>
      </div>
      <div className="carrinho-acoes">
        <button className="carrinho-btn-limpar" onClick={onLimparCarrinho}>
          🧹 Limpar Carrinho
        </button>
        <button className="carrinho-btn-finalizar" onClick={onFinalizarCompra}>
          ✅ Finalizar Compra
        </button>
      </div>
    </div>
  );
};

const ChatBot: React.FC = () => {
  const [isEnabled] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState<FiltroEstado>({});
  const [showCommands, setShowCommands] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const apiUrl = process.env.REACT_APP_API_URL;
  const [_categorias] = useState<string[]>([]);
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
  const [carrinho, setCarrinho] = useState<CarrinhoItem[]>([]);

  const userId = useRef('user-' + Math.random().toString(36).substr(2, 9));
  const navigate = useNavigate();

  // Carregar carrinho do localStorage ao inicializar
  useEffect(() => {
    const carrinhoSalvo = localStorage.getItem('carrinho');
    if (carrinhoSalvo) {
      setCarrinho(JSON.parse(carrinhoSalvo));
    }
  }, []);

  // Salvar carrinho no localStorage sempre que ele mudar
  useEffect(() => {
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
  }, [carrinho]);

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

  // Funções para gerenciar o carrinho
  

  const removerDoCarrinho = (id: string) => {
    setCarrinho(prev => prev.filter(item => item.id !== id));
  };

  const limparCarrinho = () => {
    setCarrinho([]);
  };

  const finalizarCompra = () => {
    navigate('/carrinho');
    setIsOpen(false);
  };

  const gerenciarCarrinho = (action: string, itemId?: string) => {
    switch (action) {
      case 'verCarrinho':
        // Mostrar carrinho atual
        if (carrinho.length === 0) {
          setMessages(prev => [...prev, {
            from: "bot",
            text: "🛒 Seu carrinho está vazio! Que tal explorar alguns eventos? 🎪",
            showCommands: true
          }]);
        } else {
          const total = carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
          
          let mensagemItens = "🛒 **Seu Carrinho:**\n\n";
          carrinho.forEach((item, index) => {
            mensagemItens += `${index + 1}. **${item.nomeEvento}**\n`;
            mensagemItens += `   📅 ${item.dataEvento}\n`;
            mensagemItens += `   🎫 ${item.quantidade}x R$ ${item.preco.toFixed(2)}\n`;
            mensagemItens += `   💰 Subtotal: R$ ${(item.preco * item.quantidade).toFixed(2)}\n\n`;
          });
          mensagemItens += `**💰 TOTAL: R$ ${total.toFixed(2)}**`;
          
          setMessages(prev => [...prev, {
            from: "bot",
            text: mensagemItens,
            quickReplies: [
              { text: "🗑️ Remover item", action: "removerItem" },
              { text: "🧹 Limpar carrinho", action: "limparCarrinho" },
              { text: "✅ Finalizar compra", action: "finalizarCompra" }
            ]
          }]);
        }
        break;
        
      case 'limparCarrinho':
        limparCarrinho();
        setMessages(prev => [...prev, {
          from: "bot",
          text: "🧹 Carrinho limpo com sucesso! Todos os itens foram removidos.",
          showCommands: true
        }]);
        break;
        
      case 'finalizarCompra':
        finalizarCompra();
        break;
        
      case 'removerItem':
        if (itemId) {
          removerDoCarrinho(itemId);
          setMessages(prev => [...prev, {
            from: "bot",
            text: "🗑️ Item removido do carrinho!",
            quickReplies: [
              { text: "🛒 Ver carrinho", action: "verCarrinho" },
              { text: "🎪 Continuar comprando", action: "verEventos" }
            ]
          }]);
        }
        break;
        
      default:
        break;
    }
  };

  const getMessageContent = (msg: Mensagem) => {
    if (msg.eventos && msg.eventos.length > 0) {
      return {
        showText: true,
        showEvents: true,
        showCategories: false,
        showNoResults: false,
        showCarrinho: false
      };
    }

    if (msg.categorias && msg.categorias.length > 0) {
      return {
        showText: true,
        showEvents: false,
        showCategories: true,
        showNoResults: false,
        showCarrinho: false
      };
    }

    if (msg.intent?.includes('evento')) {
      return {
        showText: true,
        showEvents: false,
        showCategories: false,
        showNoResults: true,
        showCarrinho: false
      };
    }

    if (msg.carrinho && msg.carrinho.length > 0) {
      return {
        showText: true,
        showEvents: false,
        showCategories: false,
        showNoResults: false,
        showCarrinho: true
      };
    }

    return {
      showText: true,
      showEvents: false,
      showCategories: false,
      showNoResults: false,
      showCarrinho: false
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
      state?: FiltroEstado & {
        navegarPara?: string;
      };
      quickReplies?: QuickReply[];
      carrinho?: CarrinhoItem[];
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
      const response = await fetch(`${apiUrl}/api/huggingface/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-ID': userId.current
        },
        body: JSON.stringify({
          message: textToSend,
          state: filtroEstado,
          carrinho: carrinho
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData: HuggingFaceResponse = await response.json();

      if (responseData.reply.state?.navegarPara) {
        const destino = responseData.reply.state.navegarPara;
        const nomeDestino = destino.replace('/', '').replace('-', ' ');

        const mensagemNavegacao: Mensagem = {
          from: "bot",
          text: `Te levando para ${nomeDestino}... 🚀`,
          showCommands: false
        };

        setMessages(prev => [...prev, mensagemNavegacao]);

        setTimeout(() => {
          setIsOpen(false);
          navigate(destino);
        }, 1000);

        setIsTyping(false);
        return;
      }

      if (responseData.success) {
        const botReply = responseData.reply;

        const botMessage: Mensagem = {
          from: "bot",
          text: botReply.text || "",
          intent: botReply.intent,
          confidence: botReply.confidence,
          eventos: botReply.eventos || [],
          categorias: botReply.categorias || [],
          showCommands: botReply.showCommands,
          state: botReply.state,
          quickReplies: botReply.quickReplies,
          carrinho: botReply.carrinho
        };

        if (botReply.state) {
          setFiltroEstado(botReply.state);
        }

        // Processar ações de carrinho da resposta
        if (botReply.carrinho) {
          setCarrinho(botReply.carrinho);
        }

        setMessages(prev => [...prev, botMessage]);
        setShowCommands(botReply.showCommands || false);

      } else {
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
            <button
              className="chatbot-evento-adicionar-carrinho"
              onClick={(e) => {
                e.stopPropagation();
               
                setMessages(prev => [...prev, {
                  from: "bot",
                  text: `🎫 "${evento.nome}" adicionado ao carrinho! 🛒\n\nQuantidade: 1\nPreço: R$ ${evento.valorIngressoInteira?.toFixed(2)}`,
                  quickReplies: [
                    { text: "🛒 Ver carrinho", action: "verCarrinho" },
                    { text: "🎪 Continuar comprando", action: "verEventos" },
                    { text: "✅ Finalizar compra", action: "finalizarCompra" }
                  ]
                }]);
              }}
            >
              🛒 Adicionar ao Carrinho
            </button>
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
      {!isOpen && showBalloon && isEnabled && (
        <div className="chatbot-message-floating">
          Tem alguma dúvida? <br /> Vem conhecer a Vibe Bot!!!
          <span className="chatbot-arrow"></span>
        </div>
      )}

      <motion.button
        className="chatbot-button"
        onClick={toggleChat}
        whileHover={isEnabled ? { scale: 1.1 } : {}}
        whileTap={isEnabled ? { scale: 0.95 } : {}}
        aria-label={isEnabled ? "Abrir chat" : "Chat desabilitado"}
      >
        {isOpen ? <FaTimes /> : <img src={logoChatBot} alt="logoChat" title="Foto Chatbot" style={{ height: "55px", width: "55px" }} />}
        {!isOpen && isEnabled && (
          <motion.span
            className="pulse-dot"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
        )}
      </motion.button>

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

                    {content.showEvents && msg.eventos && msg.eventos.length > 0 && (
                      <EventosLista eventos={msg.eventos} />
                    )}

                    {content.showCategories && msg.categorias && msg.categorias.length > 0 && (
                      <CategoriasLista
                        categorias={msg.categorias}
                        onCategoriaClick={(categoria) => {
                          setInputValue(categoria);
                          sendMessage(categoria);
                        }}
                      />
                    )}

                    {content.showCarrinho && msg.carrinho && msg.carrinho.length > 0 && (
                      <CarrinhoLista 
                        carrinho={msg.carrinho}
                        onRemoverItem={removerDoCarrinho}
                        onLimparCarrinho={limparCarrinho}
                        onFinalizarCompra={finalizarCompra}
                      />
                    )}

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

                    {msg.quickReplies && msg.quickReplies.length > 0 && (
                      <QuickReplies 
                        quickReplies={msg.quickReplies} 
                        onQuickReplyClick={gerenciarCarrinho}
                      />
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