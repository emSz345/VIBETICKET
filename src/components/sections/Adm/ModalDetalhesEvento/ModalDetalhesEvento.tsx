import React, { useState, useEffect, useCallback } from "react";
import { FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";
import { IoTicket, IoTime } from "react-icons/io5";
import "./ModalDetalhesEvento.css";


// TIPOS E INTERFACES
interface EventoCompleto {
    _id: string;
    nome: string;
    descricao: string;
    dataInicio: string;
    dataFim: string;
    horaInicio: string;
    horaTermino: string;
    rua: string;
    numero: string;
    bairro: string;
    cidade: string;
    estado: string;
    linkMaps: string;
    imagem: string;
    criadoPor: any;
    politicas: string[];
    valorIngressoInteira: number;
    valorIngressoMeia: number;
    temMeia: boolean;
}

interface ModalDetalhesEventoProps {
    eventoId: string;
    isOpen: boolean;
    onClose: () => void;
}

// COMPONENTE PRINCIPAL
const ModalDetalhesEvento: React.FC<ModalDetalhesEventoProps> = ({
    eventoId,
    isOpen,
    onClose
}) => {

    // STATE HOOKS
    const [imageLoaded, setImageLoaded] = useState(false);
    const [evento, setEvento] = useState<EventoCompleto | null>(null);
    const [loading, setLoading] = useState(false);

    // CONSTANTES E VARIÁVEIS
    const apiUrl = process.env.REACT_APP_API_URL;


    // EFFECT HOOKS
    const buscarDetalhesEvento = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(`${apiUrl}/api/eventos/publico/${eventoId}`);
            if (response.ok) {
                const eventoData = await response.json();
                setEvento(eventoData);
            } else {
                setEvento(null);
            }
        } catch (error) {
            console.error("Erro ao buscar detalhes do evento:", error);
            setEvento(null);
        } finally {
            setLoading(false);
        }
    }, [apiUrl, eventoId]);

    useEffect(() => {
        if (isOpen && eventoId) {
            buscarDetalhesEvento();
        }
    }, [isOpen, eventoId, buscarDetalhesEvento]);

    // HANDLER FUNCTIONS
    const handleImageLoad = () => setImageLoaded(true);
    const handleOverlayClick = (e: React.MouseEvent) => e.stopPropagation();

    // RENDER FUNCTIONS
    const renderHeader = () => {
        if (!evento) return null;

        return (
            <div className="modal-detalhes-header">
                {renderImagem()}
                <h2 className="modal-detalhes-titulo">{evento.nome}</h2>
                {renderInfoBasica()}
            </div>
        );
    };

    const renderImagem = () => {
        if (!evento) return null;

        return (
            <>
                <img
                    src={`${apiUrl}/uploads/${evento.imagem}`}
                    alt={evento.nome}
                    className="modal-detalhes-imagem"
                    onLoad={handleImageLoad}
                    style={{ opacity: imageLoaded ? 1 : 0 }}
                />
                {!imageLoaded && renderImagePlaceholder()}
            </>
        );
    };

    const renderImagePlaceholder = () => (
        <div className="image-placeholder" style={{
            width: '100%',
            height: '250px',
            background: '#f1f5f9',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#64748b'
        }}>
            Carregando imagem...
        </div>
    );

    const renderInfoBasica = () => {
        if (!evento) return null;

        return (
            <div className="modal-detalhes-info">
                <div className="modal-detalhes-info-item">
                    <FaCalendarAlt /> {evento.dataInicio}
                </div>
                <div className="modal-detalhes-info-item">
                    <IoTime /> {evento.horaInicio} - {evento.horaTermino}
                </div>
                <div className="modal-detalhes-info-item">
                    <FaMapMarkerAlt /> {evento.rua}, {evento.numero}, {evento.bairro}
                </div>
            </div>
        );
    };

    const renderDescricao = () => {
        if (!evento) return null;

        return (
            <div className="modal-detalhes-secao">
                <h3>Descrição do Evento</h3>
                <p>{evento.descricao}</p>
            </div>
        );
    };

    const renderIngressos = () => {
        if (!evento) return null;

        return (
            <div className="modal-detalhes-secao">
                <h3><IoTicket /> Informações de Ingressos</h3>
                <div className="modal-detalhes-ingressos">
                    <div className="modal-ingresso-item">
                        <span>Inteira:</span>
                        <span>R$ {evento.valorIngressoInteira.toFixed(2)}</span>
                    </div>
                    {evento.temMeia && (
                        <div className="modal-ingresso-item">
                            <span>Meia:</span>
                            <span>R$ {evento.valorIngressoMeia.toFixed(2)}</span>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const renderLocalizacao = () => {
        if (!evento) return null;

        return (
            <div className="modal-detalhes-secao">
                <h3><FaMapMarkerAlt /> Localização</h3>
                <p>{evento.cidade}, {evento.estado}</p>
                <iframe
                    src={evento.linkMaps}
                    className="modal-detalhes-mapa"
                    title="Localização do evento"
                    loading="lazy"
                ></iframe>
            </div>
        );
    };

    const renderPoliticas = () => {
        if (!evento?.politicas || evento.politicas.length === 0) return null;

        return (
            <div className="modal-detalhes-secao">
                <h3>Políticas do Evento</h3>
                <ul>
                    {evento.politicas.map((politica, index) => (
                        <li key={index}>{politica}</li>
                    ))}
                </ul>
            </div>
        );
    };

    const renderConteudo = () => {
        if (loading) {
            return <div className="modal-detalhes-loading">Carregando...</div>;
        }

        if (!evento) {
            return <div className="modal-detalhes-error">Erro ao carregar evento</div>;
        }

        return (
            <div className="modal-detalhes-container">
                {renderHeader()}
                {renderDescricao()}
                {renderIngressos()}
                {renderLocalizacao()}
                {renderPoliticas()}
            </div>
        );
    };
    // RENDER CONDITIONS
    if (!isOpen) return null;

    return (
        <div className="modal-detalhes-overlay" onClick={onClose}>
            <div className="modal-detalhes-content" onClick={handleOverlayClick}>
                <button className="modal-detalhes-close" onClick={onClose}>
                    ×
                </button>
                {renderConteudo()}
            </div>
        </div>
    );
};

export default ModalDetalhesEvento;