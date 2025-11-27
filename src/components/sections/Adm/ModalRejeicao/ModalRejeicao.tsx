import React, { useState } from "react";
import "./ModalRejeicao.css";

// INTERFACES E TIPOS
interface ModalRejeicaoProps {
    onClose: () => void;
    onConfirmar: (motivo: { titulo: string, descricao: string }) => void;
    nomeEvento: string;
}

// COMPONENTE PRINCIPAL
const ModalRejeicao: React.FC<ModalRejeicaoProps> = ({
    onClose,
    onConfirmar,
    nomeEvento
}) => {

    // STATE HOOKS
    const [titulo, setTitulo] = useState("");
    const [descricao, setDescricao] = useState("");

    // VARIÁVEIS DERIVADAS
    const isFormValid = titulo.trim() && descricao.trim();


    // HANDLER FUNCTIONS
    const handleConfirmar = () => {
        if (isFormValid) {
            onConfirmar({
                titulo: titulo.trim(),
                descricao: descricao.trim()
            });
        }
    };

    const handleTituloChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitulo(e.target.value);
    };

    const handleDescricaoChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescricao(e.target.value);
    };

    // RENDER FUNCTIONS
    const renderCabecalho = () => (
        <>
            <h2>Rejeitar Evento</h2>
            <p className="modal-rejeicao-subtitle">
                Informe o motivo da rejeição do evento: <strong>"{nomeEvento}"</strong>
            </p>
        </>
    );

    const renderCampoTitulo = () => (
        <div className="modal-rejeicao-input-group">
            <label htmlFor="titulo">Título do Motivo:</label>
            <input
                id="titulo"
                type="text"
                placeholder="Ex: Documentação incompleta"
                value={titulo}
                onChange={handleTituloChange}
                className="modal-rejeicao-input"
            />
        </div>
    );

    const renderCampoDescricao = () => (
        <div className="modal-rejeicao-input-group">
            <label htmlFor="descricao">Descrição Detalhada:</label>
            <textarea
                id="descricao"
                placeholder="Descreva em detalhes o motivo da rejeição..."
                value={descricao}
                onChange={handleDescricaoChange}
                className="modal-rejeicao-textarea"
                rows={4}
            />
        </div>
    );

    const renderBotoesAcao = () => (
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
                disabled={!isFormValid}
            >
                Confirmar Rejeição
            </button>
        </div>
    );

    return (
        <div className="modal-rejeicao-overlay">
            <div className="modal-rejeicao-content">
                {renderCabecalho()}
                {renderCampoTitulo()}
                {renderCampoDescricao()}
                {renderBotoesAcao()}
            </div>
        </div>
    );
};

export default ModalRejeicao;