import React from "react";
import { Evento } from "../../../../types/evento";
import "./EventoCard.css";
import ModalEvento from "../ModalEevnto/ModalEvento";

interface Props {
    evento: Evento;
    onAceitar: (id: string) => void;
    onRejeitar: (id: string) => void;
}

const EventoCard: React.FC<Props> = ({ evento, onAceitar, onRejeitar }) => {
    const [mostrarModal, setMostrarModal] = React.useState(false);

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
                    onAceitar={onAceitar}
                    onRejeitar={onRejeitar}
                />
            )}
        </>
    );
};

export default EventoCard;
