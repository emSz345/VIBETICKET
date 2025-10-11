// ModalDetalhesEvento.tsx
import React, { useState, useEffect, useCallback } from "react";
import { FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";
import { IoTicket, IoTime } from "react-icons/io5";
import "./ModalDetalhesEvento.css";

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

const ModalDetalhesEvento: React.FC<ModalDetalhesEventoProps> = ({ eventoId, isOpen, onClose }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [evento, setEvento] = useState<EventoCompleto | null>(null);
    const [loading, setLoading] = useState(false);
    const apiUrl = process.env.REACT_APP_API_URL;

    // Função memoizada para buscar os detalhes do evento
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

    // useEffect para buscar os detalhes quando isOpen e eventoId mudam
    useEffect(() => {
        if (isOpen && eventoId) {
            buscarDetalhesEvento();
        }
    }, [isOpen, eventoId, buscarDetalhesEvento]);

    if (!isOpen) return null;

    return (
        <div className="modal-detalhes-overlay" onClick={onClose}>
            <div className="modal-detalhes-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-detalhes-close" onClick={onClose}>×</button>

                {loading ? (
                    <div className="modal-detalhes-loading">Carregando...</div>
                ) : evento ? (
                    <div className="modal-detalhes-container">
                        {/* Header do Evento */}
                        <div className="modal-detalhes-header">
                            <img
                                src={`${apiUrl}/uploads/${evento.imagem}`}
                                alt={evento.nome}
                                className="modal-detalhes-imagem"
                                onLoad={() => setImageLoaded(true)}
                                style={{
                                    opacity: imageLoaded ? 1 : 0,
                                    transition: 'opacity 0.3s ease'
                                }}
                            />
                            {!imageLoaded && (
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
                            )}
                            <h2 className="modal-detalhes-titulo">{evento.nome}</h2>
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
                        </div>

                        {/* Descrição */}
                        <div className="modal-detalhes-secao">
                            <h3>Descrição do Evento</h3>
                            <p>{evento.descricao}</p>
                        </div>

                        {/* Ingressos */}
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

                        {/* Localização */}
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

                        {/* Políticas */}
                        {evento.politicas && evento.politicas.length > 0 && (
                            <div className="modal-detalhes-secao">
                                <h3>Políticas do Evento</h3>
                                <ul>
                                    {evento.politicas.map((politica, index) => (
                                        <li key={index}>{politica}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="modal-detalhes-error">Erro ao carregar evento</div>
                )}
            </div>
        </div>
    );
};

export default ModalDetalhesEvento;
