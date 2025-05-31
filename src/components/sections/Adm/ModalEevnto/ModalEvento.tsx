import React from "react";
import { Evento } from "../../../../types/evento";
import "./ModalEvento.css";

interface Props {
    evento: Evento;
    onClose: () => void;
    onAceitar: (id: string) => void;
    onRejeitar: (id: string) => void;
}

const ModalEvento: React.FC<Props> = ({ evento, onClose, onAceitar, onRejeitar }) => {
    return (
        <div className="modal-overlay">
            <div className="modal-conteudo">
                <button className="modal-fechar" onClick={onClose}>X</button>
                <img src={evento.imagem} alt={evento.nome} className="modal-imagem" />
                <h2>{evento.nome}</h2>

                <p><strong>Descrição:</strong> {evento.descricao}</p>
                <p><strong>Categoria:</strong> {evento.categoria}</p>
                <p><strong>Data de início:</strong> {evento.dataInicio}</p>
                <p><strong>Hora do início:</strong> {evento.horaInicio}</p>
                <p><strong>Rua:</strong> {evento.rua}</p>
                <p><strong>Cidade:</strong> {evento.cidade}</p>
                <p><strong>Estado:</strong> {evento.estado}</p>
                <p><strong>Maps:</strong> <a href={evento.linkMaps} target="_blank" rel="noreferrer">{evento.linkMaps}</a></p>

                {/* Dados do criador */}
                <div className="modal-criador">
                    <h3>Informações do Criador</h3>
                    <p><strong>ID / Nome / Email:</strong> {evento.criadoPor}</p>
                </div>

                <div className="modal-botoes">
                    <button className="btn-aceitar" onClick={() => onAceitar(evento._id)}>Aceitar</button>
                    <button className="btn-rejeitar" onClick={() => onRejeitar(evento._id)}>Rejeitar</button>
                </div>
            </div>
        </div>
    );
};

export default ModalEvento;
