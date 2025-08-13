import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Chatbot.css";
import { FaComments, FaTimes, FaMicrophone, FaPaperPlane } from "react-icons/fa";
import { BsEmojiSmile } from "react-icons/bs";

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showBalloon, setShowBalloon] = useState(true);
  const [messages, setMessages] = useState([
    { from: "bot", text: "E aí! 🎧 Bora subir essa vibe hoje?" },
    { from: "bot", text: "Eu sou seu assistente da NaVibe! 🚀" },
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

  const botResponses = [
    "Entendi! Vou anotar isso. 😎",
    "Ótima observação! Vamos trabalhar nisso. 🎶",
    "Anotado! Mais alguma coisa? 🎧",
    "Legal! Tem mais algo que eu posso ajudar? 🚀",
    "Vou passar isso para a equipe! ✨",
  ];

  const getRandomResponse = () => {
    return botResponses[Math.floor(Math.random() * botResponses.length)];
  };

  const sendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage = { from: "user", text: inputValue };
    setMessages([...messages, newMessage]);
    setInputValue("");
    setIsTyping(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: getRandomResponse() },
      ]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000);
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