import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams } from 'react-router-dom';
import "./../../styles/Categorias.css";
import NavBar3 from '../../components/sections/Home/NavBar3/NavBar3';

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

// O "Dicionário" que traduz siglas para dados completos (nome, imagem)
const mapeamentoEstados = {
    SP: { nome: "São Paulo", img: sp, id: "SP" },
    RJ: { nome: "Rio de Janeiro", img: rj, id: "RJ" },
    MA: { nome: "Maranhão", img: ma, id: "MA" },
    MG: { nome: "Minas Gerais", img: mg, id: "MG" },
    PA: { nome: "Pará", img: pa, id: "PA" },
    PR: { nome: "Paraná", img: pr, id: "PR" },
    SC: { nome: "Santa Catarina", img: sc, id: "SC" },
    RS: { nome: "Rio Grande do Sul", img: rs, id: "RS" },
    DF: { nome: "Brasília", img: df, id: "DF" },
    // Adicione outras siglas e seus dados correspondentes aqui
};

// --- Interfaces (Tipos de Dados) ---
interface Evento {
    _id: string;
    nome: string;
    imagem: string;
    dataInicio: string;
    cidade: string;
    estado: string;
}

interface Estado {
    nome: string;
    img: string;
    id: string; // id será a sigla, ex: "SP"
}

interface Filtros {
    estado: string;
}

const apiUrl = process.env.REACT_APP_API_URL;

// --- Componente Principal ---
const Categorias: React.FC = () => {
    // 1. Usa useSearchParams para gerenciar o estado do filtro na URL
    const [searchParams, setSearchParams] = useSearchParams();
    const estadoUrl = searchParams.get('estado') || '';

    // Estados para controlar os dados da API
    const [eventos, setEventos] = useState<Evento[]>([]);
    const [estadosDisponiveis, setEstadosDisponiveis] = useState<Estado[]>([]);
    const [carregandoEventos, setCarregandoEventos] = useState(true);
    const [carregandoEstados, setCarregandoEstados] = useState(true);
    const [erro, setErro] = useState<string | null>(null);

    // Estado para controlar a UI
    const [filtrosAbertos, setFiltrosAbertos] = useState(false);

    // 2. Busca os estados disponíveis quando o componente é montado
    useEffect(() => {
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

    // 3. Busca os eventos sempre que a URL com o filtro de estado mudar
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
    }, [estadoUrl]); // <-- Roda sempre que o estado na URL mudar

    const handleEstadoClick = (estadoId: string) => {
        // Se clicar no mesmo estado, remove o filtro. Caso contrário, define o novo filtro.
        if (estadoUrl === estadoId) {
            setSearchParams({});
        } else {
            setSearchParams({ estado: estadoId });
        }
        setFiltrosAbertos(false); // Fecha o menu mobile ao selecionar
    };

    const limparFiltros = () => {
        setSearchParams({});
    };

    const estadoSelecionado = estadosDisponiveis.find(e => e.id === estadoUrl);

    return (
        <div className="categorias-container">
            <NavBar3 />
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
                            <div className="lista-de-eventos">
                                {eventos.map(evento => (
                                    <div key={evento._id} className="evento-card-placeholder">
                                        <img src={`${apiUrl}/uploads/${evento.imagem}`} alt={evento.nome} />
                                        <h3>{evento.nome}</h3>
                                        <p>{`${evento.cidade} - ${evento.estado}`}</p>
                                        <p>{new Date(evento.dataInicio).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</p>
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
    );
};

// --- Componente de Conteúdo dos Filtros (Reutilizável) ---
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
            <h3 className="categorias-filtros-titulo">Estados</h3>
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
        </>
    );
};

export default Categorias;