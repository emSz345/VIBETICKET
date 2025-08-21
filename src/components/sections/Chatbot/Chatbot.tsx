import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Chatbot.css";
import { FaComments, FaTimes, FaMicrophone, FaPaperPlane } from "react-icons/fa";
import { BsEmojiSmile } from "react-icons/bs";
import axios from "axios";

import logoChatBot from "../../../assets/logo-chatbot.png"
import logoChatBot1 from "../../../assets/logo-chatBot-with.png"

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

interface Mensagem {
  from: "user" | "bot";
  text: string;
  intent?: string;
  confidence?: number;
  eventos?: Evento[];
  categorias?: string[];
  localizacao?: string;
  showCommands?: boolean; // ← Adicione esta linha
}

interface CategoriasListaProps {
  categorias: string[];
  onCategoriaClick: (categoria: string) => void;
}

interface Comando {
  texto: string;
  acao: string;
  icone: string;
}

const ComandosRapidos: React.FC<{ onComandoClick: (comando: string) => void }> = ({ onComandoClick }) => {
  const comandos: Comando[] = [
    { texto: "Eventos de Rock", acao: "Eventos de rock", icone: "🎸" },
    { texto: "Eventos em SP", acao: "Eventos em São Paulo", icone: "🏙️" },
    { texto: "Próximos eventos", acao: "Próximos eventos", icone: "📅" },
    { texto: "Categorias", acao: "Quais categorias têm?", icone: "🎵" },
    { texto: "Ajuda", acao: "Preciso de ajuda", icone: "❓" }
  ];

  return (
    <div className="comandos-rapidos">
      <div className="comandos-titulo">💡 Comandos rápidos:</div>
      <div className="comandos-grid">
        {comandos.map((comando, index) => (
          <button
            key={index}
            className="comando-btn"
            onClick={() => onComandoClick(comando.acao)}
            title={comando.acao}
          >
            <span className="comando-icone">{comando.icone}</span>
            {comando.texto}
          </button>
        ))}
      </div>
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
  const [showCommands, setShowCommands] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [showBalloon, setShowBalloon] = useState(true);
  const [messages, setMessages] = useState<Mensagem[]>([
    {
      from: "bot",
      text: "E aí! Bora subir essa vibe hoje?",
      eventos: []
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll quando mensagens mudam
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    // Mostra comandos após 3 segundos se não houver interação
    if (isOpen && messages.length <= 2) {
      const timer = setTimeout(() => {
        setShowCommands(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, messages.length]);

  // Balão reaparece a cada 1 minuto e dura 5s
  useEffect(() => {
    if (!isOpen) {
      const showBalloonNow = () => {
        setShowBalloon(true);
        setTimeout(() => setShowBalloon(false), 5000);
      };

      showBalloonNow();

      const interval = setInterval(showBalloonNow, 60000);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) setShowBalloon(false);
  };

  const sendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputValue;
    if (!textToSend.trim()) return;

    const newMessage: Mensagem = { from: "user", text: textToSend, eventos: [] };
    setMessages([...messages, newMessage]);
    setInputValue("");
    setIsTyping(true);
    setShowCommands(false);

    try {

      let messageToSend = textToSend;

      if (categorias && categorias.length > 0 && categorias.includes(textToSend)) {
      messageToSend = `Quero eventos de ${textToSend}`;
    }

      const response = await axios.post('http://localhost:5000/api/witai/chat', {
        message: messageToSend
      });



      if (response.data.success) {
        // Verifique se a resposta tem a estrutura correta
        const botReply = response.data.reply;
        const botMessage: Mensagem = {
          from: "bot",
          text: typeof botReply === 'object' ? botReply.text : botReply,
          intent: response.data.intent,
          confidence: response.data.confidence,
          eventos: response.data.eventos || [],
          categorias: response.data.categorias || [],
          showCommands: typeof botReply === 'object' ? botReply.showCommands : false
        };

        if (response.data.categorias && response.data.categorias.length > 0) {
        setCategorias(response.data.categorias);
      }

        setMessages((prev) => [...prev, botMessage]);
        setShowCommands(typeof botReply === 'object' ? botReply.showCommands : false);
      }
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: "Estou com dificuldades técnicas. Tente novamente em instantes! 🛠️",
          showCommands: true
        },
      ]);
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

    return (
      <div className="eventos-lista">
        <div className="eventos-titulo">🎪 Eventos encontrados:</div>
        {eventos.map((evento) => (
          <div key={evento._id} className="evento-card">
            <div className="evento-nome">{evento.nome}</div>
            <div className="evento-info">
              📅 {formatarData(evento.dataInicio)} às {evento.horaInicio}
            </div>
            <div className="evento-info">
              📍 {evento.cidade} - {evento.estado}
            </div>
            <div className="evento-info">
              🎵 {evento.categoria}
            </div>
            {evento.valorIngressoInteira && (
              <div className="evento-preco">
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
      {!isOpen && showBalloon && (
        <div className="chatbot-message-floating">
          Tem alguma dúvida? <br /> Vem conhecer a Vibe Bot!!!
          <span className="chatbot-arrow"></span>
        </div>
      )}

      {/* Botão Flutuante */}
      <motion.button
        className="chatbot-button"
        onClick={toggleChat}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Abrir chat"
        
      >                         {/* ALTERADO */}
        {isOpen ? <FaTimes /> : <img src={logoChatBot} title="Foto Chatbot" style={{ height: "55px", width: "55px", }} />}
        {!isOpen && (
          <motion.span
            className="pulse-dot"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
        )}
      </motion.button>

      {/* Janela do Chat */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="chatbot-container"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
          >
            <div className="chatbot-header">
              {/* ALTERADO */}
              <div className="chatbot-avatar">
                <img src={logoChatBot1} alt="" className="chatbot-avatar"/>
              </div>
              <div className="chatbot-header-info">
                <span>Vibe Bot</span>
                <small>{isTyping ? "Digitando..." : "Online"}</small>
              </div>
            </div>

            <div className="chatbot-messages">
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  className={`chatbot-message ${msg.from === "bot" ? "bot" : "user"
                    }`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {msg.text}

                  {msg.categorias && msg.categorias.length > 0 && (
                    <CategoriasLista
                      categorias={msg.categorias}
                      onCategoriaClick={(categoria) => {
                        setInputValue(categoria);
                        sendMessage(categoria);
                      }}
                    />
                  )}

                  {msg.eventos && msg.eventos.length > 0 ? (
                    <EventosLista eventos={msg.eventos} />
                  ) : msg.intent?.includes('evento') && (
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

                      {/* Sugestões de busca */}
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
              ))}
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

            {/* ALTERADO */}
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
                onClick={(e) => sendMessage()}
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