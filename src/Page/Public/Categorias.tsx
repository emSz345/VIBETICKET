import React, { useState } from "react";
import "./../../styles/Categorias.css";

// Importe as imagens dos estados (apenas para o filtro lateral)
import sp from "./../../assets/estados/estado-sp.jpg";
import rj from "./../../assets/estados/estados-rj.jpg";
import ma from "./../../assets/estados/estado_mrn.jpg";
import mg from "./../../assets/estados/estado-mg.jpg";
import pa from "./../../assets/estados/estado_pr.jpg";
import pr from "./../../assets/estados/estados-prn.jpg";
import sc from "./../../assets/estados/estado_sc.jpg";
import rs from "./../../assets/estados/estado_rgs.jpg";
import df from "./../../assets/estados/estado_df.jpg";

interface Estado {
    nome: string;
    img: string;
    id: string;
}

interface Filtros {
    estado: string;
}

const Categorias: React.FC = () => {
    const [filtrosAbertos, setFiltrosAbertos] = useState(false);
    const [filtros, setFiltros] = useState<Filtros>({
        estado: "",
    });

    const estados: Estado[] = [
        { nome: "São Paulo", img: sp, id: "sp" },
        { nome: "Rio de Janeiro", img: rj, id: "rj" },
        { nome: "Maranhão", img: ma, id: "ma" },
        { nome: "Minas Gerais", img: mg, id: "mg" },
        { nome: "Pará", img: pa, id: "pa" },
        { nome: "Paraná", img: pr, id: "pr" },
        { nome: "Santa Catarina", img: sc, id: "sc" },
        { nome: "Rio Grande do Sul", img: rs, id: "rs" },
        { nome: "Brasília", img: df, id: "df" }
    ];

    const handleFiltroChange = (campo: keyof Filtros, valor: string) => {
        setFiltros(prev => ({ ...prev, [campo]: valor }));
    };

    const handleEstadoClick = (estadoId: string) => {
        setFiltros(prev => ({
            ...prev,
            estado: prev.estado === estadoId ? "" : estadoId
        }));
    };

    const aplicarFiltros = () => {
        console.log("Filtros aplicados:", filtros);
        setFiltrosAbertos(false);
        // Aqui você implementaria a lógica para filtrar os eventos por estado
    };

    const limparFiltros = () => {
        setFiltros({
            estado: "",
        });
    };

    const estadoSelecionado = estados.find(estado => estado.id === filtros.estado);

    return (
        <div className="categorias-container">
            <div className="categorias-header">
                <h1 className="categorias-titulo">
                    {estadoSelecionado ? `Eventos em ${estadoSelecionado.nome}` : "Todos os Estados"}
                </h1>
                <button
                    className="categorias-btn-filtros"
                    onClick={() => setFiltrosAbertos(!filtrosAbertos)}
                >
                    <span>Filtros</span>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>

            {/* Filtros Mobile */}
            {filtrosAbertos && (
                <div className="categorias-filtros-mobile">
                    <div className="categorias-filtros-conteudo">
                        <FiltrosContent
                            filtros={filtros}
                            estados={estados}
                            onChange={handleFiltroChange}
                            onEstadoClick={handleEstadoClick}
                            onAplicar={aplicarFiltros}
                            onLimpar={limparFiltros}
                        />
                    </div>
                </div>
            )}

            <div className="categorias-layout">
                {/* Filtros Desktop - Com imagens */}
                <aside className="categorias-filtros-desktop">
                    <FiltrosContent
                        filtros={filtros}
                        estados={estados}
                        onChange={handleFiltroChange}
                        onEstadoClick={handleEstadoClick}
                        onAplicar={aplicarFiltros}
                        onLimpar={limparFiltros}
                    />
                </aside>

                {/* Conteúdo Principal - Apenas texto */}
                <main className="categorias-conteudo">
                    <div className="categorias-resultados">
                        {estadoSelecionado ? (
                            <div className="categorias-estado-selecionado">
                                <h2 className="categorias-estado-titulo">
                                    Eventos em {estadoSelecionado.nome}
                                </h2>
                                <p className="categorias-estado-descricao">
                                    Confira os melhores eventos que estão rolando em {estadoSelecionado.nome}!
                                </p>
                                {/* Aqui você listaria os eventos do estado selecionado */}
                            </div>
                        ) : (
                            <div className="categorias-lista-estados">
                                <h2 className="categorias-lista-titulo">Selecione um estado</h2>
                                <p className="categorias-lista-descricao">
                                    Escolha um estado no filtro lateral para ver os eventos disponíveis
                                </p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

// Componente de conteúdo dos filtros (reutilizável para mobile e desktop)
interface FiltrosContentProps {
    filtros: Filtros;
    estados: Estado[];
    onChange: (campo: keyof Filtros, valor: string) => void;
    onEstadoClick: (estadoId: string) => void;
    onAplicar: () => void;
    onLimpar: () => void;
}

const FiltrosContent: React.FC<FiltrosContentProps> = ({
    filtros,
    estados,
    onEstadoClick,
    onAplicar,
    onLimpar
}) => {
    return (
        <>
            <h3 className="categorias-filtros-titulo">Estados</h3>

            {/* Lista de Estados com imagens */}
            <div className="categorias-filtro-estados">
                {estados.map(estado => (
                    <div
                        key={estado.id}
                        className={`categorias-filtro-estado ${filtros.estado === estado.id ? "categorias-filtro-estado-selecionado" : ""
                            }`}
                        onClick={() => onEstadoClick(estado.id)}
                    >
                        <img
                            src={estado.img}
                            alt={estado.nome}
                            className="categorias-filtro-estado-imagem"
                        />
                        <span className="categorias-filtro-estado-nome">
                            {estado.nome}
                        </span>
                    </div>
                ))}
            </div>

            {/* Botões de ação */}
            <div className="categorias-filtro-botoes">
                <button
                    onClick={onLimpar}
                    className="categorias-filtro-btn categorias-filtro-btn-limpar"
                >
                    Limpar Filtros
                </button>
                <button
                    onClick={onAplicar}
                    className="categorias-filtro-btn categorias-filtro-btn-aplicar"
                >
                    Aplicar Filtros
                </button>
            </div>
        </>
    );
};

export default Categorias;