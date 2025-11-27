import React, { useState } from "react";
import { FaExclamationTriangle } from 'react-icons/fa';
import { Evento as EventoType } from "../../../../types/evento";
import "./EventoCard.css";
import ModalEvento from "../ModalEevnto/ModalEvento";
import ModalRejeicao from "../ModalRejeicao/ModalRejeicao";


// TIPOS E INTERFACES
type EventoStatus = "em_analise" | "aprovado" | "rejeitado" | "em_reanalise";

export interface CriadorPopulado {
    _id: string;
    nome?: string;
    email?: string;
    cpf?: string;
    cnpj?: string;
    tipoPessoa?: 'cpf' | 'cnpj';
}

interface EventoCardProps {
    evento: Omit<EventoType, 'criadoPor'> & {
        status: EventoStatus,
        temMeia: boolean,
        criadoPor: CriadorPopulado;
    };
    onAceitar?: (id: string) => void;
    onRejeitar?: (id: string, motivo: { titulo: string, descricao: string }) => void;
    onReanalise?: (id: string) => void;
}


// FUNÇÕES UTILITÁRIAS
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


// COMPONENTE PRINCIPAL
const EventoCard: React.FC<EventoCardProps> = ({ 
    evento, 
    onAceitar, 
    onRejeitar, 
    onReanalise 
}) => {

    // STATE HOOKS
    const [mostrarModal, setMostrarModal] = useState(false);
    const [mostrarModalRejeicao, setMostrarModalRejeicao] = useState(false);

    
    // VARIÁVEIS DERIVADAS
    const status = evento.status;
    const formattedStatus = formatStatus(status);
    
    const dadosPessoaisPendentes = !evento.criadoPor || 
        !evento.criadoPor.tipoPessoa ||
        (evento.criadoPor.tipoPessoa === 'cpf' ? !evento.criadoPor.cpf : !evento.criadoPor.cnpj);

    // HANDLER FUNCTIONS
    const handleRejeitarComMotivo = (motivo: { titulo: string, descricao: string }) => {
        if (onRejeitar) {
            onRejeitar(evento._id, motivo);
        }
        setMostrarModalRejeicao(false);
    };

    const handleAceitarClick = onAceitar ? () => onAceitar(evento._id) : undefined;
    const handleRejeitarClick = onRejeitar ? () => setMostrarModalRejeicao(true) : undefined;
    const handleReanaliseClick = onReanalise ? () => onReanalise(evento._id) : undefined;

    const handleCardClick = () => setMostrarModal(true);
    const handleCloseModal = () => setMostrarModal(false);
    const handleCloseRejeicaoModal = () => setMostrarModalRejeicao(false);

    
    // RENDER FUNCTIONS
    const renderCriadorInfo = () => {
        const criadorNome = evento.criadoPor?.nome || evento.criadoPor?._id || 'Usuário Desconhecido';
        return (
            <span className="evento-criador">
                Criado por: {criadorNome}
            </span>
        );
    };

    const renderAvisoDadosPendentes = () => {
        if (!dadosPessoaisPendentes) return null;
        
        return (
            <div className="evento-criador-aviso" title="Criador com dados pessoais pendentes (Ex: CPF)">
                <FaExclamationTriangle className="aviso-icon" />
                <span className="aviso-texto">Dados Pendentes</span>
            </div>
        );
    };

    return (
        <>
            <div 
                className={`evento-card status-${status.replace('_', '-')}`} 
                onClick={handleCardClick}
            >
                {/* Cabeçalho com imagem e status */}
                <div className="evento-cabecalho">
                    <img 
                        src={evento.imagem} 
                        alt={`Capa do evento ${evento.nome}`} 
                        className="evento-imagem" 
                    />
                    <div className={`evento-status-tag status-${status.replace('_', '-')}`}>
                        {formattedStatus}
                    </div>
                </div>

                {/* Corpo com nome do evento */}
                <div className="evento-corpo">
                    <h3 className="evento-nome">{evento.nome}</h3>
                </div>

                {/* Rodapé com informações do criador */}
                <div className="evento-rodape">
                    {renderCriadorInfo()}
                    {renderAvisoDadosPendentes()}
                </div>
            </div>

            {/* Modal de Detalhes do Evento */}
            {mostrarModal && (
                <ModalEvento
                    evento={evento}
                    onClose={handleCloseModal}
                    onAceitar={handleAceitarClick}
                    onRejeitar={handleRejeitarClick}
                    onReanalise={handleReanaliseClick}
                />
            )}

            {/* Modal de Rejeição */}
            {mostrarModalRejeicao && onRejeitar && (
                <ModalRejeicao
                    onClose={handleCloseRejeicaoModal}
                    onConfirmar={handleRejeitarComMotivo}
                    nomeEvento={evento.nome}
                />
            )}
        </>
    );
};

export default EventoCard;