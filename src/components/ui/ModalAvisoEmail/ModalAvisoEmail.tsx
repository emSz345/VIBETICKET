import React from 'react';
import './ModalAvisoEmail.css'; // Vamos criar este CSS em seguida
import { FaCheckCircle } from 'react-icons/fa'; // Ícone de sucesso

interface ModalAvisoProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
}

const ModalAviso: React.FC<ModalAvisoProps> = ({ isOpen, onClose, title, message }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-aviso-overlay" onClick={onClose}>
      <div className="modal-aviso-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-aviso-icon">
          <FaCheckCircle />
        </div>
        <h3 className="modal-aviso-title">{title}</h3>
        <p className="modal-aviso-message">{message}</p>
        <button className="modal-aviso-btn" onClick={onClose}>
          Entendi
        </button>
      </div>
    </div>
  );
};

export default ModalAviso;