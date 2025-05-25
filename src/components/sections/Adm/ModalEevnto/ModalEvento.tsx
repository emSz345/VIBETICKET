import React from "react";
import { Evento } from "../../../../types/evento";
import "./ModalEvento.css";

interface Props {
    evento: Evento;
    onClose: () => void;
    onAceitar: (id: number) => void;
    onRejeitar: (id: number) => void;
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
                <p><strong>Data de início:</strong> {evento.data}</p>
                <p><strong>Hora do início:</strong> {evento.hora}</p>
                <p><strong>Bairro:</strong> {evento.local.bairro}</p>
                <p><strong>Cidade:</strong> {evento.local.cidade}</p>
                <p><strong>Estado:</strong> {evento.local.estado}</p>
                <p><strong>Rua:</strong> {evento.local.rua}</p>
                <p><strong>Maps:</strong> {evento.local.urlMaps}</p>
                <p><strong>Ingressos:</strong> {evento.ingressos}</p>

                {/* Dados do criador */}
                <div className="modal-criador">
                    <h3>Informações do Criador</h3>
                    <p><strong>Nome:</strong> {evento.criador?.nome}</p>
                    <p><strong>Email:</strong> {evento.criador?.email}</p>
                </div>

                <div className="modal-botoes">
                    <button className="btn-aceitar" onClick={() => onAceitar(evento.id)}>Aceitar</button>
                    <button className="btn-rejeitar" onClick={() => onRejeitar(evento.id)}>Rejeitar</button>
                </div>
            </div>
        </div>
    );
};

export default ModalEvento;