import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import NavBar from "../../components/sections/Home/NavBar/NavBar";
import "../../styles/detalhes.css";
import Footer from "../../components/layout/Footer/Footer";

import { FaCalendarAlt, FaMapMarkerAlt, FaTicketAlt } from "react-icons/fa";

import logo from '../../assets/img-logo.png'

import { MdEmail } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";

import { IoTicket } from "react-icons/io5";


const Detalhes: React.FC = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Exemplo de tipos de ingresso
    const [tiposIngresso, setTiposIngresso] = useState([
        { tipo: "Inteira", valor: 25.99, quantidade: 0 },
        { tipo: "Meia", valor: 12.99, quantidade: 0 },
    ]);

    const LIMITE_MAXIMO_INGRESSOS = 5;

    const aumentarQuantidade = (index: number) => {
        setTiposIngresso(prev =>
            prev.map((ingresso, i) =>
                i === index && ingresso.quantidade < LIMITE_MAXIMO_INGRESSOS
                    ? { ...ingresso, quantidade: ingresso.quantidade + 1 }
                    : ingresso
            )
        );
    };

    const diminuirQuantidade = (index: number) => {
        setTiposIngresso(prev =>
            prev.map((ingresso, i) =>
                i === index && ingresso.quantidade > 0
                    ? { ...ingresso, quantidade: ingresso.quantidade - 1 }
                    : ingresso
            )
        );
    };

    const comprarIngresso = (ingresso: { tipo: string, valor: number, quantidade: number }) => {
        if (ingresso.quantidade > 0) {
            alert(`Você comprou ${ingresso.quantidade} ingresso(s) do tipo ${ingresso.tipo}`);
        } else {
            alert("Selecione pelo menos um ingresso antes de comprar.");
        }
    };

    const { state } = useLocation();

    if (!state) {
        return <h2>Evento não encontrado!</h2>;
    }

    return (
        <>
            <NavBar />

            <div className="detalhes-container">
                <div className="detalhes-fundo">
                    <div className="detalhes-glass">
                        <div className="detalhes-conteudos">
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
                            </div>

                            <img
                                src={state.imagem}
                                alt={state.titulo}
                                className="detalhes-imagem-evento"
                            />
                        </div>
                    </div>
                </div>

                <div className="detalhes-topo-evento">

                    <div className="detalhes-container-conteudo">
                        <div className="detalhes-ingressos-box">
                            <h3 className="detalhes-title-ingresso">Ingresso</h3>
                            <div className="detalhes-ingressos-tipos">
                                {tiposIngresso.map((ingresso, index) => (
                                    <div key={index} className="detalhes-ingresso-card">
                                        <div className="ingresso-info">
                                            <span className="tipo">
                                                <IoTicket />
                                                {ingresso.tipo}
                                            </span>
                                            <span className="preco">
                                                {ingresso.tipo === 'Gratuita' ? 'Gratuito' : `R$ ${ingresso.valor.toFixed(1)}`}
                                            </span>
                                        </div>

                                        <div className="ingresso-selector">
                                            <button onClick={() => diminuirQuantidade(index)}>-</button>
                                            <span>{ingresso.quantidade}</span>
                                            <button onClick={() => aumentarQuantidade(index)}>+</button>
                                        </div>

                                        <button className="detalhes-btn-comprar" onClick={() => comprarIngresso(ingresso)}>
                                            Comprar {ingresso.tipo}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="detalhes-container-descricao">
                            <div>
                                <div className="detalhes-descricao">
                                    <h3 className="detalhes-title-descricao">Descrição</h3>
                                    <p>
                                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Mollitia cumque temporibus amet commodi, architecto natus consequatur hic aspernatur cum nulla aperiam, aut, rerum sit quia quis possimus saepe deleniti molestias!


                                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur magni quasi accusamus corporis, aut ducimus a itaque consequuntur repudiandae ad soluta hic molestiae blanditiis ex maxime illo vitae quos cumque.
                                    </p>
                                </div>

                                <div className="detalhes-contaier-politicas">
                                    <h3 className="detalhes-title-descricao">Politica do evento</h3>
                                </div>
                            </div>
                        </div>
                    </div>


                </div>

                {/* Mapa */}
                <div className="detalhes-bloco">
                    <h3 className="detalhes-titulo-mapa">Localização do Show</h3>

                    <div className="detalhes-container-mapa">
                        <iframe
                            title="Mapa do Evento"
                            src={`https://www.google.com/maps?q=${encodeURIComponent(state.local)}&output=embed`}
                            className="detalhes-mapa"
                            allowFullScreen
                            loading="lazy"
                        ></iframe>
                    </div>
                </div>


                <div className="detalhes-container-organizador">
                    <div className="detalhes-organizador">
                        <div className="detalhes-foto">
                            {/* <img src={state.organizador?.foto || logo} alt="Organizador" /> */}
                        </div>
                        <h3 className="detalhes-title">{state.organizador?.nome || "Nome do organizador"}</h3>

                        <div className="detalhes-contato">
                            <MdEmail size={20} />
                            <span>{state.organizador?.email || "email@organizador.com"}</span>
                        </div>

                        <div className="detalhes-contato">
                            <FaPhoneAlt size={17} />
                            <span>{state.organizador?.telefone || "(99) 99999-9999"}</span>
                        </div>
                    </div>
                </div>

            </div>
            <Footer />
        </>
    );
};

export default Detalhes;