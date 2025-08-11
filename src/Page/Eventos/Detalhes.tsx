import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../../styles/detalhes.css";
import Footer from "../../components/layout/Footer/Footer";
import {
    FaCalendarAlt,
    FaMapMarkerAlt,
    FaTicketAlt,
    FaPhoneAlt,
    FaShareAlt
} from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { IoTicket } from "react-icons/io5";
import { FiMinus, FiPlus } from "react-icons/fi";

interface TicketType {
    tipo: string;
    valor: number;
    quantidade: number;
    descricao?: string;
}

interface Organizador {
    nome: string;
    email: string;
    telefone: string;
    foto?: string;
}

interface Evento {
    titulo: string;
    data: string;
    local: string;
    imagem: string;
    vendidos: number;
    descricao: string;
    politicas: string[];
    organizador?: Organizador;
}

const Detalhes: React.FC = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const LIMITE_MAXIMO_INGRESSOS = 8;
    const [activeTab, setActiveTab] = useState<'descricao' | 'politicas'>('descricao');

    const [tiposIngresso, setTiposIngresso] = useState<TicketType[]>([
        {
            tipo: "Inteira",
            valor: 25.99,
            quantidade: 0,
            descricao: "Ingresso padrão para todos os públicos"
        },
        {
            tipo: "Meia",
            valor: 12.99,
            quantidade: 0,
            descricao: "Para estudantes, idosos e pessoas com deficiência (com documentação)"
        }
    ]);

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

    const adicionarAoCarrinho = (ingresso: TicketType) => {
        if (ingresso.quantidade > 0) {
            alert(`${ingresso.quantidade} ingresso(s) ${ingresso.tipo} adicionado(s) ao carrinho!`);
            // Aqui você implementaria a lógica real do carrinho
        } else {
            alert("Selecione pelo menos um ingresso");
        }
    };

    const calcularTotal = () => {
        return tiposIngresso.reduce((total, ingresso) => {
            return total + (ingresso.valor * ingresso.quantidade);
        }, 0).toFixed(2);
    };

    const { state } = useLocation() as { state: Evento };

    if (!state) {
        return (
            <div className="evento-nao-encontrado">
                <h2>Evento não encontrado!</h2>
                <p>Volte à página inicial para explorar nossos eventos.</p>
            </div>
        );
    }

    return (
        <>
            <div className="detalhes-container">
                {/* Cabeçalho com imagem e informações básicas */}
                <div className="detalhes-header">
                    <div className="detalhes-header-content">
                        <div className="detalhes-info-evento">
                            <h1 className="detalhes-titulo-evento">{state.titulo}</h1>

                            <div className="detalhes-meta-info">
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

                            <button className="share-button">
                                <FaShareAlt /> Compartilhar
                            </button>
                        </div>

                        <img
                            src={state.imagem}
                            alt={state.titulo}
                            className="detalhes-imagem-evento"
                        />
                    </div>
                </div>

                {/* Corpo principal */}
                <div className="detalhes-main-content">
                    {/* Seção de Ingressos */}
                    <div className="detalhes-ingressos-box">
                        <h3 className="detalhes-title-ingresso">
                            <IoTicket /> Escolha seus ingressos
                        </h3>

                        <div className="detalhes-ingressos-tipos">
                            {tiposIngresso.map((ingresso, index) => (
                                <div key={index} className="detalhes-ingresso-card">
                                    <div className="ingresso-header">
                                        <span className="tipo">
                                            <IoTicket />
                                            {ingresso.tipo}
                                        </span>
                                        <span className="preco">
                                            {ingresso.valor === 0 ? 'Grátis' : `R$ ${ingresso.valor.toFixed(2)}`}
                                        </span>
                                    </div>

                                    {ingresso.descricao && (
                                        <p className="ingresso-descricao">{ingresso.descricao}</p>
                                    )}

                                    <div className="ingresso-controls">
                                        <div className="ingresso-selector">
                                            <button
                                                onClick={() => diminuirQuantidade(index)}
                                                disabled={ingresso.quantidade === 0}
                                            >
                                                <FiMinus />
                                            </button>
                                            <span>{ingresso.quantidade}</span>
                                            <button
                                                onClick={() => aumentarQuantidade(index)}
                                                disabled={ingresso.quantidade >= LIMITE_MAXIMO_INGRESSOS}
                                            >
                                                <FiPlus />
                                            </button>
                                        </div>

                                        <button
                                            className="detalhes-btn-comprar"
                                            onClick={() => adicionarAoCarrinho(ingresso)}
                                            disabled={ingresso.quantidade === 0}
                                        >
                                            Adicionar ao Carrinho
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="ingresso-total">
                            <span>Total:</span>
                            <span className="total-valor">R$ {calcularTotal()}</span>
                        </div>
                    </div>

                    {/* Seção de Descrição e Políticas */}
                    <div className="detalhes-info-container">
                        <div className="detalhes-tabs">
                            <button
                                className={`tab-button ${activeTab === 'descricao' ? 'active' : ''}`}
                                onClick={() => setActiveTab('descricao')}
                            >
                                Descrição
                            </button>
                            <button
                                className={`tab-button ${activeTab === 'politicas' ? 'active' : ''}`}
                                onClick={() => setActiveTab('politicas')}
                            >
                                Políticas
                            </button>
                        </div>

                        <div className="detalhes-tab-content">
                            {activeTab === 'descricao' ? (
                                <div className="detalhes-descricao">
                                    <p>{state.descricao}</p>
                                </div>
                            ) : (
                                <div className="detalhes-politicas">
                                    <ul>
                                        {state.politicas?.map((politica, index) => (
                                            <li key={index}>{politica}</li>
                                        )) || [
                                            "Reembolsos serão aceitos até 48 horas antes do evento",
                                            "Após este período, não será possível realizar reembolsos",
                                            "O valor reembolsado será creditado em até 5 dias úteis",
                                            "Para solicitar reembolso, entre em contato com o organizador"
                                        ].map((politica, index) => (
                                            <li key={index}>{politica}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Mapa de Localização */}
                <div className="detalhes-bloco">
                    <h3 className="detalhes-titulo-mapa">
                        <FaMapMarkerAlt /> Localização do Evento
                    </h3>

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

                {/* Informações do Organizador */}
                <div className="detalhes-container-organizador">
                    <h3 className="detalhes-title">Organizador do Evento</h3>

                    <div className="detalhes-organizador">
                        <div className="detalhes-organizador-info">
                            <h4>{state.organizador?.nome || "Produção Cultural Ltda"}</h4>

                            <div className="detalhes-contato">
                                <MdEmail size={20} />
                                <span>{state.organizador?.email || "contato@eventos.com.br"}</span>
                            </div>

                            <div className="detalhes-contato">
                                <FaPhoneAlt size={17} />
                                <span>{state.organizador?.telefone || "(11) 98765-4321"}</span>
                            </div>

                        </div>

                        <div className="detalhes-organizador-avatar">
                            <div className="avatar-placeholder">
                                {state.organizador?.nome?.charAt(0) || "P"}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
};

export default Detalhes;