import React from "react";
import { Evento } from "../../../../types/evento";
import "./ModalEvento.css";

interface ModalEventoProps {
    evento: Evento;
    onClose: () => void;
    onAceitar: () => void;
    onRejeitar: () => void; // Agora apenas abre o modal de rejeição
}

const ModalEvento: React.FC<ModalEventoProps> = ({ evento, onClose, onAceitar, onRejeitar }) => {
    return (
        <div className="modal-evento-overlay">
            <div className="modal-evento-conteudo">
                <button className="modal-evento-fechar" onClick={onClose}>×</button>

                {/* Cabeçalho */}
                <div className="modal-evento-header">
                    <img src={evento.imagem} alt={evento.nome} className="modal-evento-imagem" />
                    <h2 className="modal-evento-titulo">{evento.nome}</h2>
                    <p className="modal-evento-data">{evento.dataInicio} • {evento.horaInicio}</p>
                </div>

                {/* Lista de informações - UMA ABAIXO DA OUTRA */}
                <div className="modal-evento-lista">
                    <div className="modal-evento-item">
                        <strong className="modal-evento-label">Descrição:</strong>
                        <p className="modal-evento-texto">{evento.descricao}</p>
                    </div>

                    <div className="modal-evento-item">
                        <strong className="modal-evento-label">Categoria:</strong>
                        <span>{evento.categoria}</span>
                    </div>

                    <div className="modal-evento-item">
                        <strong className="modal-evento-label">Data e Horário:</strong>
                        <div>
                            <p>Início: {evento.dataInicio} às {evento.horaInicio}</p>
                            <p>Término: {evento.horaTermino}</p>
                        </div>
                    </div>

                    <div className="modal-evento-item">
                        <strong className="modal-evento-label">Localização:</strong>
                        <div>
                            <p>Endereço: {evento.rua}</p>
                            <p>Cidade: {evento.cidade}</p>
                            <p>Estado: {evento.estado}</p>
                            <p>
                                Mapa: <a href={evento.linkMaps} target="_blank" rel="noreferrer" className="modal-evento-link">Link do Google Maps</a>
                            </p>
                        </div>
                    </div>

                    <div className="modal-evento-item">
                        <strong className="modal-evento-label">Criador do Evento:</strong>
                        <span>{evento.criadoPor}</span>
                    </div>
                </div>

                {/* Botões */}
                <div className="modal-evento-botoes">
                    <button className="modal-evento-btn modal-evento-btn-rejeitar" onClick={onRejeitar}>
                        Rejeitar
                    </button>
                    <button className="modal-evento-btn modal-evento-btn-aceitar" onClick={onAceitar}>
                        Aceitar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalEvento;