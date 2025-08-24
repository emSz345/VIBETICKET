import React from "react";
import { Evento } from "../../../../types/evento";
import "./EventoCard.css";
import ModalEvento from "../ModalEevnto/ModalEvento";
import ModalRejeicao from "../ModalRejeicao/ModalRejeicao"; 

interface EventoCardProps {
    evento: Evento;
    onAceitar: (id: string) => void;
    onRejeitar: (id: string, motivo: { titulo: string, descricao: string }) => void;
    onReanalise: (id: string) => void;
}

const EventoCard: React.FC<EventoCardProps> = ({ evento, onAceitar, onRejeitar, onReanalise }) => {
    const [mostrarModal, setMostrarModal] = React.useState(false);
    const [mostrarModalRejeicao, setMostrarModalRejeicao] = React.useState(false);

    const handleRejeitarComMotivo = (motivo: { titulo: string, descricao: string }) => {
        onRejeitar(evento._id, motivo);
        setMostrarModalRejeicao(false);
    };

    return (
        <>
            <div className="evento-card" onClick={() => setMostrarModal(true)}>
                <img src={evento.imagem} alt="Evento" className="evento-imagem" />
                <div className="evento-dados">
                    <p><strong>{evento.nome}</strong></p>
                    <p>{evento.criadoPor}</p>
                </div>
            </div>

            {mostrarModal && (
                <ModalEvento
                    evento={evento}
                    onClose={() => setMostrarModal(false)}
                    onAceitar={() => onAceitar(evento._id)}
                    onRejeitar={() => setMostrarModalRejeicao(true)}
                />
            )}
            {mostrarModalRejeicao && (
                <ModalRejeicao
                    onClose={() => setMostrarModalRejeicao(false)}
                    onConfirmar={handleRejeitarComMotivo}
                    nomeEvento={evento.nome}
                />
            )}
        </>
    );
};

export default EventoCard;
