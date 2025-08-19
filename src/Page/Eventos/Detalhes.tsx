import React, { useState, useEffect } from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import "../../styles/detalhes.css";
import Footer from "../../components/layout/Footer/Footer";
import {
    FaCalendarAlt, FaMapMarkerAlt, FaShareAlt
} from "react-icons/fa";
import { IoTicket } from "react-icons/io5";
import { FiMinus, FiPlus } from "react-icons/fi";
import { Evento } from '../home-eventos/evento';

// Adicionei 'politicas' à interface Evento
interface EventoComPoliticas extends Evento {
    politicas: string[]; // Alterado para array de strings
}

interface TicketType {
    tipo: string;
    valor: number;
    quantidade: number;
    descricao?: string;
}

const Detalhes: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { state } = useLocation();

    const [evento, setEvento] = useState<EventoComPoliticas | null>(state as EventoComPoliticas || null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);

        const buscarEventoPorId = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/eventos/${id}`);
                if (!response.ok) {
                    throw new Error('Evento não encontrado');
                }
                const data: EventoComPoliticas = await response.json();
                setEvento(data);
            } catch (error) {
                console.error("Erro ao buscar evento:", error);
                setEvento(null);
            } finally {
                setIsLoading(false);
            }
        };

        if (!evento && id) {
            buscarEventoPorId();
        } else {
            setIsLoading(false);
        }
    }, [id, evento, state]);

    const LIMITE_MAXIMO_INGRESSOS = 8;
    const [activeTab, setActiveTab] = useState<'descricao' | 'politicas'>('descricao');

    const [tiposIngresso, setTiposIngresso] = useState<TicketType[]>(() => {
        if (!evento) return [];

        const valorInteira = Number(evento.valorIngressoInteira) || 0;
        const valorMeia = Number(evento.valorIngressoMeia) || 0;

        const ingressos: TicketType[] = [
            {
                tipo: "Inteira",
                valor: valorInteira,
                quantidade: 0,
                descricao: "Ingresso padrão para todos os públicos"
            }
        ];

        if (evento.temMeia) {
            ingressos.push({
                tipo: "Meia",
                valor: valorMeia,
                quantidade: 0,
                descricao: "Para estudantes, idosos e pessoas com deficiência (com documentação)"
            });
        }

        return ingressos;
    });

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
        } else {
            alert("Selecione pelo menos um ingresso");
        }
    };

    const calcularTotal = () => {
        return tiposIngresso.reduce((total, ingresso) => {
            return total + (ingresso.valor * ingresso.quantidade);
        }, 0).toFixed(2);
    };

    if (isLoading) {
        return <div>Carregando evento...</div>;
    }

    if (!evento) {
        return (
            <div className="evento-nao-encontrado">
                <h2>Evento não encontrado!</h2>
                <p>Verifique o link ou volte à página inicial para explorar nossos eventos.</p>
            </div>
        );
    }

    const imageUrl = `http://localhost:5000/uploads/${evento.imagem}`;

    // Políticas padrão caso não existam no evento
    const politicasPadrao = [
        "Reembolsos serão aceitos até 48 horas antes do evento",
        "É obrigatório apresentar um documento de identificação com foto na entrada",
        "O evento não se responsabiliza por objetos perdidos",
        "Proibida a entrada de menores de 18 anos, salvo com autorização judicial"
    ];

    const politicasDoEvento = evento.politicas && evento.politicas.length > 0 ? evento.politicas : politicasPadrao;

    return (
        <>
            <div className="detalhes-container">
                <div className="detalhes-header">
                    <div className="detalhes-header-content">
                        <div className="detalhes-info-evento">
                            <h1 className="detalhes-titulo-evento">{evento.nome}</h1>
                            <div className="detalhes-meta-info">
                                <div className="detalhes-info-linha">
                                    <span className="detalhes-label"><FaCalendarAlt /> Data:</span>
                                    <span>{evento.dataInicio}</span>
                                </div>
                                <div className="detalhes-info-linha">
                                    <span className="detalhes-label"><FaMapMarkerAlt /> Local:</span>
                                    <span>{evento.rua}, {evento.numero}, {evento.bairro} - {evento.cidade}, {evento.estado}</span>
                                </div>
                            </div>
                            <button className="share-button">
                                <FaShareAlt /> Compartilhar
                            </button>
                        </div>
                        {evento.imagem && (
                            <img src={imageUrl} alt={evento.nome} className="detalhes-imagem-evento" />
                        )}
                    </div>
                </div>

                <div className="detalhes-main-content">
                    <div className="detalhes-ingressos-box">
                        <h3 className="detalhes-title-ingresso">
                            <IoTicket /> Escolha seus ingressos
                        </h3>
                        <div className="detalhes-ingressos-tipos">
                            {tiposIngresso.map((ingresso, index) => (
                                <div key={index} className="detalhes-ingresso-card">
                                    <div className="ingresso-header">
                                        <span className="tipo"><IoTicket /> {ingresso.tipo}</span>
                                        <span className="preco">{ingresso.valor === 0 ? 'Grátis' : `R$ ${ingresso.valor.toFixed(2)}`}</span>
                                    </div>
                                    {ingresso.descricao && (<p className="ingresso-descricao">{ingresso.descricao}</p>)}
                                    <div className="ingresso-controls">
                                        <div className="ingresso-selector">
                                            <button onClick={() => diminuirQuantidade(index)} disabled={ingresso.quantidade === 0}><FiMinus /></button>
                                            <span>{ingresso.quantidade}</span>
                                            <button onClick={() => aumentarQuantidade(index)} disabled={ingresso.quantidade >= LIMITE_MAXIMO_INGRESSOS}><FiPlus /></button>
                                        </div>
                                        <button className="detalhes-btn-comprar" onClick={() => adicionarAoCarrinho(ingresso)} disabled={ingresso.quantidade === 0}>
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

                    <div className="detalhes-info-container">
                        <div className="detalhes-tabs">
                            <button className={`tab-button ${activeTab === 'descricao' ? 'active' : ''}`} onClick={() => setActiveTab('descricao')}>
                                Descrição
                            </button>
                            <button className={`tab-button ${activeTab === 'politicas' ? 'active' : ''}`} onClick={() => setActiveTab('politicas')}>
                                Políticas
                            </button>
                        </div>
                        <div className="detalhes-tab-content">
                            {activeTab === 'descricao' ? (
                                <div className="detalhes-descricao">
                                    <p>{evento.descricao}</p>
                                </div>
                            ) : (
                                <div className="detalhes-politicas">
                                    <h3>Políticas do Evento</h3>
                                    <ul>
                                        {politicasDoEvento.map((politica, index) => (
                                            <li key={index}>{politica}</li>
                                        ))}
                                    </ul>
                                    <hr className="detalhes-divider" />
                                    <h3>Termos e Condições</h3>
                                    <p>Ao comprar ingressos para este evento, você concorda com os</p>
                                    <Link to="/Termos" className="termos-link" target="_blank" rel="noopener noreferrer">
                                        Termos e Condições.
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="detalhes-bloco">
                    <h3 className="detalhes-titulo-mapa">
                        <FaMapMarkerAlt /> Localização do Evento
                    </h3>
                    <div className="detalhes-container-mapa">
                        <iframe
                            title="Mapa do Evento"
                            src={evento.linkMaps}
                            className="detalhes-mapa"
                            allowFullScreen
                            loading="lazy"
                        ></iframe>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Detalhes;