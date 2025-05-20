import React from "react";
import { useLocation } from "react-router-dom";
import NavBar from "../../components/sections/Home/NavBar/NavBar";
import "../../styles/detalhes.css";
import Footer from "../../components/layout/Footer/Footer";

import { FaCalendarAlt, FaMapMarkerAlt, FaTicketAlt } from "react-icons/fa";

const Detalhes: React.FC = () => {
    const { state } = useLocation();

    if (!state) {
        return <h2>Evento não encontrado!</h2>;
    }

    return (
        <>
            <NavBar />

            <div className="detalhes-container">
                <div className="detalhes-topo-evento">
                    <img
                        src={state.imagem}
                        alt={state.titulo}
                        className="detalhes-imagem-evento"
                    />

                    <div className="detalhes-info-evento">
                        <h1 className="detalhes-titulo-evento">{state.titulo}</h1>

                        <div className="detalhes-info-linha">
                            <span className="detalhes-label"><FaCalendarAlt /> Data:</span>
                            <span>{state.data}</span>
                        </div>
                        <div className="detalhes-info-linha">
                            <span className="detalhes-label"><FaMapMarkerAlt /> Local:</span>
                            <span>{state.local}</span>
                        </div>
                        <div className="detalhes-info-linha">
                            <span className="detalhes-label"><FaTicketAlt /> Ingressos vendidos:</span>
                            <span>{state.vendidos}</span>
                        </div>

                        <div className="detalhes-ingressos-box">
                            <h3>Ingressos disponíveis</h3>

                            <div className="detalhes-ingressos-tipos">
                                <div className="detalhes-ingresso-card">
                                    <div className="ingresso-info">
                                        <span className="tipo">
                                            <FaTicketAlt className="icon-ingresso" />
                                            Inteira
                                        </span>
                                        <span className="preco">R$ 25,99</span>
                                    </div>
                                </div>

                                <div className="detalhes-ingresso-card">
                                    <div className="ingresso-info">
                                        <span className="tipo">
                                            <FaTicketAlt className="icon-ingresso" />
                                            Meia
                                        </span>
                                        <span className="preco">R$ 12,99</span>
                                    </div>
                                </div>
                            </div>

                            <button className="detalhes-btn-comprar">Comprar Ingressos</button>
                        </div>
                    </div>
                </div>

                {/* Mapa */}
                <div className="detalhes-bloco">
                    <h3>Localização do show</h3>
                    <iframe
                        title="Mapa do Evento"
                        src={`https://www.google.com/maps?q=${encodeURIComponent(state.local)}&output=embed`}
                        width="100%"
                        height="350"
                        style={{ border: 0, borderRadius: '12px' }}
                        allowFullScreen
                        loading="lazy"
                    ></iframe>
                </div>

                <div className="detalhes-descricao-politicas">
                    <div className="detalhes-bloco">
                        <h3>Descrição do evento</h3>
                        <p>
                            Celebre conosco um momento inesquecível! Este evento foi cuidadosamente planejado
                            para proporcionar uma experiência única, repleta de emoção, alegria e memórias que
                            ficarão para sempre no coração de todos os presentes.
                        </p>
                        <p>
                            Desde a recepção calorosa até o encerramento com chave de ouro, tudo foi pensado para
                            tornar este evento um verdadeiro espetáculo.
                        </p>
                    </div>

                    <div className="detalhes-bloco">
                        <h3>Políticas do evento</h3>
                        <ul>
                            <li>Não será permitida a entrada após o horário de início do evento.</li>
                            <li>Ingressos são pessoais e intransferíveis.</li>
                            <li>Apresente um documento com foto na entrada.</li>
                            <li>Não haverá reembolso em caso de ausência.</li>
                        </ul>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
};

export default Detalhes;