import React from "react";
import { Evento } from "../../../../types/evento";
import "./EventoCard.css";
import ModalEvento from "../ModalEevnto/ModalEvento";
import ModalRejeicao from "../ModalRejeicao/ModalRejeicao";

type EventoStatus = "em_analise" | "aprovado" | "rejeitado" | "em_reanalise";

// Função utilitária para formatar o status para exibição
const formatStatus = (status: EventoStatus): string => {
    switch (status) {
        case 'em_analise':
            return 'Em Análise';
        case 'aprovado':
            return 'Aprovado';
        case 'rejeitado':
            return 'Rejeitado';
        case 'em_reanalise':
            return 'Em Reanálise';
        default:
            return 'Desconhecido';
    }
}

interface EventoCardProps {
    // Tipo estendido para garantir a segurança dos campos que usamos (status, temMeia, etc)
    evento: Evento & { status: EventoStatus, temMeia: boolean };
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
    
    // Lê o status real do evento
    const status = evento.status;
    const formattedStatus = formatStatus(status);

    return (
        <>
            <div className={`evento-card status-${status.replace('_', '-')}`} onClick={() => setMostrarModal(true)}>
                <div className="evento-cabecalho">
                    <img src={evento.imagem} alt={`Capa do evento ${evento.nome}`} className="evento-imagem" />
                    <div className={`evento-status-tag status-${status.replace('_', '-')}`}>
                        {formattedStatus}
                    </div>
                </div>
                
                <div className="evento-corpo">
                    <h3 className="evento-nome">{evento.nome}</h3>
                </div>
                
                <div className="evento-rodape">
                    <span className="evento-criador">Criado por: **{evento.criadoPor}**</span>
                </div>
            </div>

            {mostrarModal && (
                <ModalEvento
                    evento={evento}
                    onClose={() => setMostrarModal(false)}
                    onAceitar={() => onAceitar(evento._id)}
                    onRejeitar={() => setMostrarModalRejeicao(true)}
                    onReanalise={() => onReanalise(evento._id)}
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