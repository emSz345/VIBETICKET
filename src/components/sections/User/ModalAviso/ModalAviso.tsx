import React from 'react';
import { FaTimes, FaExclamationTriangle, FaTrash } from 'react-icons/fa';
import './ModalAviso.css';

// Define os tipos de modal que podemos ter
type ModalType = 'confirmacao' | 'aviso';
// Define os temas de ícone/cor
type ModalTheme = 'perigo' | 'info';

interface ModalAvisoProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm?: () => void; // Opcional, só para 'confirmacao'

    type: ModalType;
    theme?: ModalTheme;
    title: string;
    children: React.ReactNode;

    labelConfirmar?: string; // Texto customizado para o botão de confirmar
    isLoading?: boolean;
}

const ModalAviso: React.FC<ModalAvisoProps> = ({
    isOpen,
    onClose,
    onConfirm,
    type,
    theme = 'info',
    title,
    children,
    labelConfirmar = "Confirmar",
    isLoading = false
}) => {
    if (!isOpen) {
        return null;
    }

    // Define o ícone e a cor com base no tema
    const Icone = theme === 'perigo' ? FaExclamationTriangle : FaTrash;
    const themeClass = `modal-aviso--${theme}`;

    return (
        <div className="modal-aviso-backdrop" onClick={onClose}>
            <div className={`modal-aviso-content ${themeClass}`} onClick={(e) => e.stopPropagation()}>

                <header className="modal-aviso-header">
                    <div className="modal-aviso-icon">
                        <Icone />
                    </div>
                    <h3>{title}</h3>
                    <button onClick={onClose} className="modal-aviso-close-btn" disabled={isLoading}>
                        <FaTimes />
                    </button>
                </header>

                <main className="modal-aviso-body">
                    {children}
                </main>

                <footer className="modal-aviso-footer">
                    {type === 'confirmacao' && (
                        <button
                            className="modal-btn-cancelar"
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            Cancelar
                        </button>
                    )}

                    <button
                        // Se for 'aviso', o botão principal é 'onClose'
                        // Se for 'confirmacao', o botão principal é 'onConfirm'
                        className={`modal-btn-principal ${themeClass}`}
                        onClick={type === 'confirmacao' ? onConfirm : onClose}
                        disabled={isLoading}
                    >
                        {isLoading
                            ? 'Processando...'
                            : (type === 'confirmacao' ? labelConfirmar : 'Entendi')}
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default ModalAviso;