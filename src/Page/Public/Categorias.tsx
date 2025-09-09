import React, { useState, useEffect } from "react";
import axios from "axios"; // Usaremos axios para facilitar as chamadas
import "./../../styles/Categorias.css";

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
    // Estados para controlar os dados da API
    const [eventos, setEventos] = useState<Evento[]>([]);
    const [estadosDisponiveis, setEstadosDisponiveis] = useState<Estado[]>([]);
    const [carregandoEventos, setCarregandoEventos] = useState(true);
    const [carregandoEstados, setCarregandoEstados] = useState(true);
    const [erro, setErro] = useState<string | null>(null);

    // Estados para controlar os filtros e a UI
    const [filtrosAbertos, setFiltrosAbertos] = useState(false);
    const [filtros, setFiltros] = useState<Filtros>({ estado: "" });

    // 1. Busca os estados disponíveis quando o componente é montado
    useEffect(() => {
        const fetchEstados = async () => {
            try {
                setCarregandoEstados(true);
                const response = await axios.get(`${apiUrl}/api/eventos/estados`);
                const siglasDosEstados: string[] = response.data;

                const estadosCompletos = siglasDosEstados
                    .map(sigla => mapeamentoEstados[sigla.toUpperCase() as keyof typeof mapeamentoEstados])
                    .filter(Boolean); // Filtra siglas que não estão no nosso mapa

                setEstadosDisponiveis(estadosCompletos);
            } catch (err) {
                console.error("Erro ao buscar estados:", err);
                setErro("Não foi possível carregar os filtros de estado.");
            } finally {
                setCarregandoEstados(false);
            }
        };

        fetchEstados();
    }, []); // O array vazio [] garante que isso rode apenas uma vez

    // 2. Busca os eventos sempre que o filtro de estado mudar
    useEffect(() => {
        const fetchEventos = async () => {
            try {
                setCarregandoEventos(true);
                setErro(null);

                const url = new URL(`${apiUrl}/api/eventos/aprovados`);
                if (filtros.estado) {
                    url.searchParams.append('estado', filtros.estado);
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
    }, [filtros.estado]); // Roda sempre que `filtros.estado` mudar

    const handleEstadoClick = (estadoId: string) => {
        setFiltros(prev => ({ ...prev, estado: prev.estado === estadoId ? "" : estadoId }));
        setFiltrosAbertos(false); // Fecha o menu mobile ao selecionar
    };

    const limparFiltros = () => {
        setFiltros({ estado: "" });
    };

    const estadoSelecionado = estadosDisponiveis.find(e => e.id === filtros.estado);

    return (
        <div className="categorias-container">
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
                            filtros={filtros}
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
                        filtros={filtros}
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
                            <div className="lista-de-eventos"> {/* Usando uma classe para o grid de eventos */}
                                {eventos.map(evento => (
                                    // Você pode substituir este div pelo seu componente de Card de Evento
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
    carregando: boolean; // Adicionado para mostrar feedback de carregamento
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
                {/* O botão "Aplicar" foi removido pois a busca é automática ao clicar no estado */}
            </div>
        </>
    );
};

export default Categorias;

//-----Posivel adição-----//

// import ac from "./../../assets/estados/estado-ac.jpg";
// import al from "./../../assets/estados/estado-al.jpg";
// import ap from "./../../assets/estados/estado-ap.jpg";
// import am from "./../../assets/estados/estado-am.jpg";
// import ba from "./../../assets/estados/estado-ba.jpg";
// import ce from "./../../assets/estados/estado-ce.jpg";
// import df from "./../../assets/estados/estado-df.jpg";
// import es from "./../../assets/estados/estado-es.jpg";
// import go from "./../../assets/estados/estado-go.jpg";
// import ma from "./../../assets/estados/estado_mrn.jpg"; // Mantive seu nome original
// import mt from "./../../assets/estados/estado-mt.jpg";
// import ms from "./../../assets/estados/estado-ms.jpg";
// import mg from "./../../assets/estados/estado-mg.jpg";
// import pa from "./../../assets/estados/estado-pa.jpg"; // Você tinha um nome diferente aqui, padronizei
// import pb from "./../../assets/estados/estado-pb.jpg";
// import pr from "./../../assets/estados/estados-prn.jpg"; // Mantive seu nome original
// import pe from "./../../assets/estados/estado-pe.jpg";
// import pi from "./../../assets/estados/estado-pi.jpg";
// import rj from "./../../assets/estados/estados-rj.jpg";
// import rn from "./../../assets/estados/estado-rn.jpg";
// import rs from "./../../assets/estados/estado_rgs.jpg"; // Mantive seu nome original
// import ro from "./../../assets/estados/estado-ro.jpg";
// import rr from "./../../assets/estados/estado-rr.jpg";
// import sc from "./../../assets/estados/estado_sc.jpg"; // Mantive seu nome original
// import sp from "./../../assets/estados/estado-sp.jpg";
// import se from "./../../assets/estados/estado-se.jpg";
// import to from "./../../assets/estados/estado-to.jpg";


// // Dicionário completo de estados para traduzir as siglas vindas do backend
// const mapeamentoEstados = {
//     // Região Norte
//     AC: { nome: "Acre", img: ac, id: "AC" },
//     AP: { nome: "Amapá", img: ap, id: "AP" },
//     AM: { nome: "Amazonas", img: am, id: "AM" },
//     PA: { nome: "Pará", img: pa, id: "PA" },
//     RO: { nome: "Rondônia", img: ro, id: "RO" },
//     RR: { nome: "Roraima", img: rr, id: "RR" },
//     TO: { nome: "Tocantins", img: to, id: "TO" },

//     // Região Nordeste
//     AL: { nome: "Alagoas", img: al, id: "AL" },
//     BA: { nome: "Bahia", img: ba, id: "BA" },
//     CE: { nome: "Ceará", img: ce, id: "CE" },
//     MA: { nome: "Maranhão", img: ma, id: "MA" },
//     PB: { nome: "Paraíba", img: pb, id: "PB" },
//     PE: { nome: "Pernambuco", img: pe, id: "PE" },
//     PI: { nome: "Piauí", img: pi, id: "PI" },
//     RN: { nome: "Rio Grande do Norte", img: rn, id: "RN" },
//     SE: { nome: "Sergipe", img: se, id: "SE" },
    
//     // Região Centro-Oeste
//     DF: { nome: "Distrito Federal", img: df, id: "DF" },
//     GO: { nome: "Goiás", img: go, id: "GO" },
//     MT: { nome: "Mato Grosso", img: mt, id: "MT" },
//     MS: { nome: "Mato Grosso do Sul", img: ms, id: "MS" },

//     // Região Sudeste
//     ES: { nome: "Espírito Santo", img: es, id: "ES" },
//     MG: { nome: "Minas Gerais", img: mg, id: "MG" },
//     RJ: { nome: "Rio de Janeiro", img: rj, id: "RJ" },
//     SP: { nome: "São Paulo", img: sp, id: "SP" },

//     // Região Sul
//     PR: { nome: "Paraná", img: pr, id: "PR" },
//     RS: { nome: "Rio Grande do Sul", img: rs, id: "RS" },
//     SC: { nome: "Santa Catarina", img: sc, id: "SC" },
// };