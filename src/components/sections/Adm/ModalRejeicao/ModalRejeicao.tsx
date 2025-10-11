import React, { useState } from "react";
import "./ModalRejeicao.css";

interface ModalRejeicaoProps {
    onClose: () => void;
    onConfirmar: (motivo: { titulo: string, descricao: string }) => void;
    nomeEvento: string;
}

const ModalRejeicao: React.FC<ModalRejeicaoProps> = ({ onClose, onConfirmar, nomeEvento }) => {
    const [titulo, setTitulo] = useState("");
    const [descricao, setDescricao] = useState("");

    const handleConfirmar = () => {
        if (titulo.trim() && descricao.trim()) {
            onConfirmar({ titulo: titulo.trim(), descricao: descricao.trim() });
        }
    };

    return (
        <div className="modal-rejeicao-overlay">
            <div className="modal-rejeicao-content">
                <h2>Rejeitar Evento</h2>
                <p className="modal-rejeicao-subtitle">
                    Informe o motivo da rejeição do evento: <strong>"{nomeEvento}"</strong>
                </p>

                <div className="modal-rejeicao-input-group">
                    <label htmlFor="titulo">Título do Motivo:</label>
                    <input
                        id="titulo"
                        type="text"
                        placeholder="Ex: Documentação incompleta"
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                        className="modal-rejeicao-input"
                    />
                </div>

                <div className="modal-rejeicao-input-group">
                    <label htmlFor="descricao">Descrição Detalhada:</label>
                    <textarea
                        id="descricao"
                        placeholder="Descreva em detalhes o motivo da rejeição..."
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                        className="modal-rejeicao-textarea"
                        rows={4}
                    />
                </div>

                <div className="modal-rejeicao-actions">
                    <button 
                        className="modal-rejeicao-btn-cancelar"
                        onClick={onClose}
                    >
                        Cancelar
                    </button>
                    <button 
                        className="modal-rejeicao-btn-confirmar"
                        onClick={handleConfirmar}
                        disabled={!titulo.trim() || !descricao.trim()}
                    >
                        Confirmar Rejeição
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalRejeicao;