import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from 'react-router-dom';
import "./../../styles/Categorias.css";
import NavBar3 from '../../components/sections/Home/NavBar3/NavBar3';
import Rodape from '../../components/layout/Footer/Footer'; // Importe o Rodape

// Importe as imagens dos estados
import sp from "./../../assets/estados/estado-sp.jpg";
import rj from "./../../assets/estados/estados-rj.jpg";
import ma from "./../../assets/estados/estado_mrn.jpg";
import mg from "./../../assets/estados/estado-mg.jpg";
import pa from "./../../assets/estados/estado_pr.jpg";
import pr from "./../../assets/estados/estados-prn.jpg";
import sc from "./../../assets/estados/estado_sc.jpg";
import rs from "./../../assets/estados/estado_rgs.jpg";
import df from "./../../assets/estados/estado_df.jpg";

import ac from "./../../assets/estados/estado-ac.jpg";
import al from "./../../assets/estados/estado-al.png";
import ap from "./../../assets/estados/estado-ap.png";
import am from "./../../assets/estados/estado-am.png";
import ba from "./../../assets/estados/estado-ba.png";
import ce from "./../../assets/estados/estado-ce.png";
import es from "./../../assets/estados/estado-es.png";
import go from "./../../assets/estados/estado-go.png";
import mt from "./../../assets/estados/estado-mt.png";
import ms from "./../../assets/estados/estado-ms.png";
import pb from "./../../assets/estados/estado-pb.png";
import pe from "./../../assets/estados/estado-pe.png";
import pi from "./../../assets/estados/estado-pi.png";
import rn from "./../../assets/estados/estado-rn.png";
import ro from "./../../assets/estados/estado-ro.png";
import rr from "./../../assets/estados/estado-rr.png";
import se from "./../../assets/estados/estado-se.png";
import to from "./../../assets/estados/estado-to.png";

import ChatBot from "../../components/sections/Chatbot/Chatbot";


const mapeamentoEstados = {
    SP: { nome: "São Paulo", img: sp, id: "SP" },
    RJ: { nome: "Rio de Janeiro", img: rj, id: "RJ" },
    MA: { nome: "Maranhão", img: ma, id: "MA" },
    MG: { nome: "Minas Gerais", img: mg, id: "MG" },
    PA: { nome: "Pará", img: pa, id: "PA" },
    PR: { nome: "Paraná", img: pr, id: "PR" },
    SC: { nome: "Santa Catarina", img: sc, id: "SC" },
    RS: { nome: "Rio Grande do Sul", img: rs, id: "RS" },
    DF: { nome: "Distrito Federal", img: df, id: "DF" },

    AC: { nome: "Acre", img: ac, id: "AC" },
    AL: { nome: "Alagoas", img: al, id: "AL" },
    AP: { nome: "Amapá", img: ap, id: "AP" },
    AM: { nome: "Amazonas", img: am, id: "AM" },
    BA: { nome: "Bahia", img: ba, id: "BA" },
    CE: { nome: "Ceará", img: ce, id: "CE" },
    ES: { nome: "Espírito Santo", img: es, id: "ES" },
    GO: { nome: "Goiás", img: go, id: "GO" },
    MT: { nome: "Mato Grosso", img: mt, id: "MT" },
    MS: { nome: "Mato Grosso do Sul", img: ms, id: "MS" },
    PB: { nome: "Paraíba", img: pb, id: "PB" },
    PE: { nome: "Pernambuco", img: pe, id: "PE" },
    PI: { nome: "Piauí", img: pi, id: "PI" },
    RN: { nome: "Rio Grande do Norte", img: rn, id: "RN" },
    RO: { nome: "Rondônia", img: ro, id: "RO" },
    RR: { nome: "Roraima", img: rr, id: "RR" },
    SE: { nome: "Sergipe", img: se, id: "SE" },
    TO: { nome: "Tocantins", img: to, id: "TO" },
};

interface Evento {
    _id: string;
    nome: string;
    imagem: string;
    dataInicio: string;
    cidade: string;
    estado: string;
    rua?: string;
}

interface Estado {
    nome: string;
    img: string;
    id: string;
}

interface Filtros {
    estado: string;
}

const apiUrl = process.env.REACT_APP_API_URL;

const Categorias: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const estadoUrl = searchParams.get('estado') || '';
    const navigate = useNavigate();

    const [eventos, setEventos] = useState<Evento[]>([]);
    const [estadosDisponiveis, setEstadosDisponiveis] = useState<Estado[]>([]);
    const [carregandoEventos, setCarregandoEventos] = useState(true);
    const [carregandoEstados, setCarregandoEstados] = useState(true);
    const [erro, setErro] = useState<string | null>(null);

    const [filtrosAbertos, setFiltrosAbertos] = useState(false);

    useEffect(() => {
        // Scroll para o topo quando a página carregar
        window.scrollTo(0, 0);

        const fetchEstados = async () => {
            try {
                setCarregandoEstados(true);
                const response = await axios.get(`${apiUrl}/api/eventos/estados`);
                const siglasDosEstados: string[] = response.data;

                const estadosCompletos = siglasDosEstados
                    .map(sigla => mapeamentoEstados[sigla.toUpperCase() as keyof typeof mapeamentoEstados])
                    .filter(Boolean);

                setEstadosDisponiveis(estadosCompletos);
            } catch (err) {
                console.error("Erro ao buscar estados:", err);
                setErro("Não foi possível carregar os filtros de estado.");
            } finally {
                setCarregandoEstados(false);
            }
        };
        fetchEstados();
    }, []);

    useEffect(() => {
        const fetchEventos = async () => {
            try {
                setCarregandoEventos(true);
                setErro(null);

                const url = new URL(`${apiUrl}/api/eventos/aprovados`);
                if (estadoUrl) {
                    url.searchParams.append('estado', estadoUrl);
                }

                const response = await axios.get(url.toString());
                setEventos(response.data);
            } catch (err) {
                console.error("Erro ao buscar eventos:", err);
                setErro("Não foi possível carregar os eventos.");
            } finally {
                setCarregandoEventos(false);
            }
        };
        fetchEventos();
    }, [estadoUrl]);

    const handleEventoClick = (id: string) => {
        navigate(`/evento/${id}`);
    };

    const handleEstadoClick = (estadoId: string) => {
        if (estadoUrl === estadoId) {
            setSearchParams({});
        } else {
            setSearchParams({ estado: estadoId });
        }
        setFiltrosAbertos(false);
    };

    const limparFiltros = () => {
        setSearchParams({});
    };

    const estadoSelecionado = estadosDisponiveis.find(e => e.id === estadoUrl);

    return (
        <> {/* Use um fragmento para englobar todo o conteúdo */}
            <div className="categorias-container">
                <NavBar3 />

                {/* Conteúdo principal que cresce */}
                <div className="categorias-main-content">
                    <div className="categorias-header">
                        <h1 className="categorias-titulo">
                            {estadoSelecionado ? `Eventos em ${estadoSelecionado.nome}` : "Todos os Eventos"}
                        </h1>
                        <button className="categorias-btn-filtros" onClick={() => setFiltrosAbertos(!filtrosAbertos)}>
                            <span>Filtros</span>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </button>
                    </div>

                    {filtrosAbertos && (
                        <div className="categorias-filtros-mobile">
                            <div className="categorias-filtros-conteudo">
                                <FiltrosContent
                                    filtros={{ estado: estadoUrl }}
                                    estados={estadosDisponiveis}
                                    onEstadoClick={handleEstadoClick}
                                    onLimpar={limparFiltros}
                                    carregando={carregandoEstados}
                                />
                            </div>
                        </div>
                    )}

                    <div className="categorias-layout">
                        <aside className="categorias-filtros-desktop">
                            <FiltrosContent
                                filtros={{ estado: estadoUrl }}
                                estados={estadosDisponiveis}
                                onEstadoClick={handleEstadoClick}
                                onLimpar={limparFiltros}
                                carregando={carregandoEstados}
                            />
                        </aside>

                        <main className="categorias-conteudo">
                            <div className="categorias-resultados">
                                {carregandoEventos ? (
                                    <p>Carregando eventos...</p>
                                ) : erro ? (
                                    <p className="categorias-erro">{erro}</p>
                                ) : eventos.length > 0 ? (
                                    <div className="categorias-lista-eventos">
                                        {eventos.map(evento => (
                                            <div
                                                key={evento._id}
                                                className="categorias-card-evento"
                                                onClick={() => handleEventoClick(evento._id)}
                                            >
                                                <div className="categorias-card-imagem-wrapper">
                                                    <img
                                                        src={`${apiUrl}/uploads/${evento.imagem}`}
                                                        alt={evento.nome}
                                                        className="categorias-card-imagem"
                                                    />
                                                    <span className="categorias-card-data">
                                                        {new Date(evento.dataInicio).toLocaleDateString("pt-BR", {
                                                            day: "2-digit",
                                                            month: "short"
                                                        })}
                                                    </span>
                                                </div>

                                                <div className="categorias-card-conteudo">
                                                    <span className="categorias-card-data-completa">
                                                        {new Date(evento.dataInicio).toLocaleDateString("pt-BR", {
                                                            weekday: "long",
                                                            day: "2-digit",
                                                            month: "long"
                                                        }).toUpperCase()}
                                                    </span>

                                                    <h4 className="categorias-card-titulo">{evento.nome}</h4>

                                                    <div className="categorias-card-info">
                                                        <p className="categorias-card-local">
                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                                            </svg>
                                                            {evento.cidade} - {evento.estado}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="categorias-lista-estados">
                                        <h2 className="categorias-lista-titulo">Nenhum evento encontrado</h2>
                                        <p className="categorias-lista-descricao">
                                            Tente selecionar outro estado ou limpar os filtros.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </main>
                    </div>
                </div>
            </div>
            <Rodape />
        </>
    );
};

interface FiltrosContentProps {
    filtros: Filtros;
    estados: Estado[];
    onEstadoClick: (estadoId: string) => void;
    onLimpar: () => void;
    carregando: boolean;
}

const FiltrosContent: React.FC<FiltrosContentProps> = ({ filtros, estados, onEstadoClick, onLimpar, carregando }) => {
    if (carregando) {
        return <p>Carregando filtros...</p>;
    }

    return (
        <>
            <h3 className="categorias-filtros-titulo">Estados ativos</h3>
            <div className="categorias-filtro-estados">
                {estados.map(estado => (
                    <div
                        key={estado.id}
                        className={`categorias-filtro-estado ${filtros.estado === estado.id ? "categorias-filtro-estado-selecionado" : ""}`}
                        onClick={() => onEstadoClick(estado.id)}
                    >
                        <img src={estado.img} alt={estado.nome} className="categorias-filtro-estado-imagem" />
                        <span className="categorias-filtro-estado-nome">{estado.nome}</span>
                    </div>
                ))}
            </div>
            <div className="categorias-filtro-botoes">
                <button onClick={onLimpar} className="categorias-filtro-btn categorias-filtro-btn-limpar">
                    Limpar Filtros
                </button>
            </div>
            <div style={{ display: "flex", right: "20px", bottom: "30px", position: 'fixed', zIndex: '1000' }}>
                <ChatBot />
            </div>
        </>
    );
};

export default Categorias;