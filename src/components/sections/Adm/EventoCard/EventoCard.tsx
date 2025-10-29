import React from "react";
import { Evento as EventoType } from "../../../../types/evento";
import "./EventoCard.css";
import ModalEvento from "../ModalEevnto/ModalEvento";
import ModalRejeicao from "../ModalRejeicao/ModalRejeicao";
import { FaExclamationTriangle } from 'react-icons/fa';

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

export interface CriadorPopulado {
    _id: string;
    nome?: string;
    email?: string;
    cpf?: string;
    cnpj?: string;
    tipoPessoa?: 'cpf' | 'cnpj';
}

interface EventoCardProps {
    // Usa o EventoType importado e sobrescreve 'criadoPor'
    evento: Omit<EventoType, 'criadoPor'> & {
        status: EventoStatus,
        temMeia: boolean,
        criadoPor: CriadorPopulado; // <-- Agora espera o objeto populado
    };

    onAceitar?: (id: string) => void;
    onRejeitar?: (id: string, motivo: { titulo: string, descricao: string }) => void;
    onReanalise?: (id: string) => void;
}

const EventoCard: React.FC<EventoCardProps> = ({ evento, onAceitar, onRejeitar, onReanalise }) => {
    const [mostrarModal, setMostrarModal] = React.useState(false);
    const [mostrarModalRejeicao, setMostrarModalRejeicao] = React.useState(false);

    // FUNÇÃO DE SEGURANÇA para rejeição
    const handleRejeitarComMotivo = (motivo: { titulo: string, descricao: string }) => {
        if (onRejeitar) {
            onRejeitar(evento._id, motivo);
        }
        setMostrarModalRejeicao(false);
    };

    // FUNÇÕES AUXILIARES: Geram o callback para o ModalEvento ou undefined
    const handleAceitarClick = onAceitar ? () => onAceitar(evento._id) : undefined;
    const handleRejeitarClick = onRejeitar ? () => setMostrarModalRejeicao(true) : undefined;
    const handleReanaliseClick = onReanalise ? () => onReanalise(evento._id) : undefined;


    const status = evento.status;
    const formattedStatus = formatStatus(status);

    const dadosPessoaisPendentes = !evento.criadoPor || // Se não houver criador, considera pendente
        !evento.criadoPor.tipoPessoa ||
        (evento.criadoPor.tipoPessoa === 'cpf' ? !evento.criadoPor.cpf : !evento.criadoPor.cnpj);

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
                    {/* Exibe o nome do criador (ou ID se não tiver nome) */}
                    <span className="evento-criador">
                        {/* Usa ?. também no _id e adiciona um fallback final */}
                        Criado por: {evento.criadoPor?.nome || evento.criadoPor?._id || 'Usuário Desconhecido'}
                    </span>

                    {/* Mostra o aviso se dadosPessoaisPendentes for true */}
                    {dadosPessoaisPendentes && (
                        <div className="evento-criador-aviso" title="Criador com dados pessoais pendentes (Ex: CPF)">
                            <FaExclamationTriangle className="aviso-icon" />
                            <span className="aviso-texto">Dados Pendentes</span>
                        </div>
                    )}
                </div>
            </div>

            {mostrarModal && (
                <ModalEvento
                    evento={evento}
                    onClose={() => setMostrarModal(false)}
                    // Passando as funções auxiliares (que podem ser undefined)
                    onAceitar={handleAceitarClick}
                    onRejeitar={handleRejeitarClick}
                    onReanalise={handleReanaliseClick}
                />
            )}
            {/* ModalRejeicao é renderizado se a flag estiver ativa E a ação de rejeitar for permitida */}
            {mostrarModalRejeicao && onRejeitar && (
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