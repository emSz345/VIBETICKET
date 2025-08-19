import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Chatbot.css";
import { FaComments, FaTimes, FaMicrophone, FaPaperPlane } from "react-icons/fa";
import { BsEmojiSmile } from "react-icons/bs";
import axios from "axios";

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
  localizacao?: string; // ← Adicione esta linha
}


const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showBalloon, setShowBalloon] = useState(true);
  const [messages, setMessages] = useState<Mensagem[]>([
    {
      from: "bot",
      text: "E aí! 🎧 Bora subir essa vibe hoje?",
      eventos: []
    },
    {
      from: "bot",
      text: "Eu sou seu assistente da NaVibe! 🚀",
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

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    const newMessage: Mensagem = { from: "user", text: inputValue, eventos: [] };
    setMessages([...messages, newMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      const response = await axios.post('http://localhost:5000/api/witai/chat', {
        message: inputValue
      });

      if (response.data.success) {
        const botMessage: Mensagem = {
          from: "bot",
          text: response.data.reply,
          intent: response.data.intent,
          confidence: response.data.confidence,
          eventos: response.data.eventos || []
        };

        setMessages((prev) => [...prev, botMessage]);
      } else {
        setMessages((prev) => [
          ...prev,
          { from: "bot", text: response.data.error || "Ops, tive um probleminha aqui. Pode repetir?", eventos: [] },
        ]);
      }
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "Estou com dificuldades técnicas. Tente novamente em instantes! 🛠️", eventos: [] },
      ]);
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
          Tem alguma dúvida? <br /> Vem conhecer a LitVive!!!
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
      >
        {isOpen ? <FaTimes /> : <FaComments />}
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
              <div className="chatbot-avatar">🎧</div>
              <div className="chatbot-header-info">
                <span>NaVibe Bot</span>
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

            <div className="chatbot-input">
              <button className="emoji-button">
                <BsEmojiSmile />
              </button>
              <input
                type="text"
                placeholder="Digite sua mensagem..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button className="voice-button">
                <FaMicrophone />
              </button>
              <button
                className="send-button"
                onClick={sendMessage}
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