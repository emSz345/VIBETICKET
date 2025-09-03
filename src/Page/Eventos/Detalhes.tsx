import React, { useState, useEffect } from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import "../../styles/detalhes.css"; // Certifique-se de que este caminho está correto
import Footer from "../../components/layout/Footer/Footer";
import {
    FaCalendarAlt, FaMapMarkerAlt, FaShareAlt,
    FaUserCircle, FaEnvelope
} from "react-icons/fa";
import { IoTicket, IoTime } from "react-icons/io5";
import { FiMinus, FiPlus } from "react-icons/fi";
import { Evento } from '../../components/sections/Home/home-eventos/evento';
import { CarrinhoService } from '../../services/carrinhoService';
import { CarrinhoItem } from "../../types/carrinho";

// Interface para os dados do criador obtidos da rota de users
interface CriadorUsuario {
    email: string;
    imagemPerfil: string;
    nome: string;
}

// Interface para os dados do criador obtidos da rota de perfil
interface CriadorPerfil {
    dadosOrganizacao?: {
        nomeFantasia: string;
    };
    dadosPessoais?: {
        telefone: string;
    };
}

// Interface do evento com o ID do criador corrigido
interface EventoComCriador extends Evento {
    criadoPor: string;
    politicas: string[];
}

interface TicketType {
    tipo: string;
    valor: number;
    quantidade: number;
    descricao?: string;
}

const Detalhes: React.FC = () => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const { id } = useParams<{ id: string }>();
    const { state } = useLocation();

    // Estados do componente
    const [evento, setEvento] = useState<EventoComCriador | null>(state as EventoComCriador || null);
    const [criadorUsuario, setCriadorUsuario] = useState<CriadorUsuario | null>(null);
    const [criadorPerfil, setCriadorPerfil] = useState<CriadorPerfil | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [tiposIngresso, setTiposIngresso] = useState<TicketType[] | undefined>(undefined);
    const [activeTab, setActiveTab] = useState<'descricao' | 'politicas'>('descricao');
    const [showSuccessModal, setShowSuccessModal] = useState(false); // Novo estado para a modal

    // Função para obter a URL da imagem de perfil do criador
    const getCriadorImagemUrl = (imagemPerfil?: string) => {
        if (imagemPerfil) {
            if (imagemPerfil.startsWith('http')) {
                return imagemPerfil;
            }
            return `${apiUrl}/uploads/${imagemPerfil}`;
        }
        return `${apiUrl}/uploads/blank_profile.png`;
    };

    // Efeito principal: busca os dados do evento, do usuário e do perfil
    useEffect(() => {
        window.scrollTo(0, 0);

        const buscarDados = async () => {
            setIsLoading(true);
            try {
                const eventoResponse = await fetch(`${apiUrl}/api/eventos/publico/${id}`);
                if (!eventoResponse.ok) {
                    throw new Error('Evento não encontrado');
                }
                const eventoData: EventoComCriador = await eventoResponse.json();
                setEvento(eventoData);

                const valorInteira = Number(eventoData.valorIngressoInteira) || 0;
                const valorMeia = Number(eventoData.valorIngressoMeia) || 0;
                const ingressos: TicketType[] = [
                    { tipo: "Inteira", valor: valorInteira, quantidade: 0, descricao: "Ingresso padrão para todos os públicos" }
                ];
                if (eventoData.temMeia && valorMeia > 0) {
                    ingressos.push({ tipo: "Meia", valor: valorMeia, quantidade: 0, descricao: "Para estudantes, idosos e pessoas com deficiência (com documentação)" });
                }
                setTiposIngresso(ingressos);

                if (eventoData.criadoPor) {
                    const criadorId = eventoData.criadoPor;

                    const [userRes, perfilRes] = await Promise.allSettled([
                        fetch(`${apiUrl}/api/users/${criadorId}`),
                        fetch(`${apiUrl}/api/perfil/${criadorId}`)
                    ]);

                    if (userRes.status === 'fulfilled' && userRes.value.ok) {
                        const userData: CriadorUsuario = await userRes.value.json();
                        setCriadorUsuario(userData);
                    } else {
                        console.error('Erro ao buscar dados do usuário. Verifique se o ID está correto ou se a rota está funcionando.');
                    }

                    if (perfilRes.status === 'fulfilled' && perfilRes.value.ok) {
                        const perfilData: CriadorPerfil = await perfilRes.value.json();
                        setCriadorPerfil(perfilData);
                    } else {
                        console.error('Erro ao buscar dados de perfil. Verifique a rota ou o formato dos dados.');
                    }
                } else {
                    console.error("ID do criador não encontrado no objeto do evento.");
                }

            } catch (error) {
                console.error("Erro ao buscar dados:", error);
                setEvento(null);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            buscarDados();
        } else {
            setIsLoading(false);
        }
    }, [id, apiUrl]);

    // Funções de manipulação de ingressos e carrinho
    const aumentarQuantidade = (index: number) => {
        setTiposIngresso(prev => {
            return (prev || []).map((ingresso, i) =>
                i === index && ingresso.quantidade < 8 // Limite de 8 ingressos
                    ? { ...ingresso, quantidade: ingresso.quantidade + 1 }
                    : ingresso
            );
        });
    };

    const diminuirQuantidade = (index: number) => {
        setTiposIngresso(prev => {
            return (prev || []).map((ingresso, i) =>
                i === index && ingresso.quantidade > 0
                    ? { ...ingresso, quantidade: ingresso.quantidade - 1 }
                    : ingresso
            );
        });
    };

    const adicionarAoCarrinho = async (ingresso: TicketType) => {
        if (ingresso.quantidade === 0) {
            alert("Selecione pelo menos um ingresso.");
            return;
        }

        try {
            const response = await fetch(`${apiUrl}/api/eventos/verificar-estoque/${evento?._id}`);
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Erro na resposta da API:', errorText);
                alert('Não foi possível verificar a disponibilidade de ingressos. Tente novamente.');
                return;
            }

            const estoque = await response.json();
            const itensDoCarrinho = CarrinhoService.getCarrinho();
            const itemExistente = itensDoCarrinho.find((item: CarrinhoItem) =>
                item.eventoId === evento?._id && item.tipoIngresso === ingresso.tipo
            );

            const quantidadeNoCarrinho = itemExistente ? itemExistente.quantidade : 0;
            const totalSolicitado = ingresso.quantidade + quantidadeNoCarrinho;

            let estoqueDisponivel = 0;
            if (ingresso.tipo === 'Inteira') {
                estoqueDisponivel = estoque.quantidadeInteira;
            } else if (ingresso.tipo === 'Meia') {
                estoqueDisponivel = estoque.quantidadeMeia;
            }

            if (totalSolicitado > estoqueDisponivel) {
                alert(`Desculpe, não há ingressos ${ingresso.tipo} suficientes disponíveis.`);
                return;
            }

            const novoItem: CarrinhoItem = {
                id: `${evento?._id}-${ingresso.tipo}`,
                eventoId: evento?._id || '',
                nomeEvento: evento?.nome || '',
                tipoIngresso: ingresso.tipo,
                preco: ingresso.valor,
                quantidade: ingresso.quantidade,
                imagem: evento?.imagem || '',
                dataEvento: evento?.dataInicio || '',
                localEvento: `${evento?.rua}, ${evento?.numero}, ${evento?.bairro} - ${evento?.cidade}, ${evento?.estado}`
            };

            CarrinhoService.adicionarOuAtualizarItem(novoItem);

            // Ativa a modal de sucesso
            setShowSuccessModal(true);
            setTimeout(() => {
                setShowSuccessModal(false);
            }, 3000); // Esconde a modal após 3 segundos

        } catch (error) {
            console.error('Erro ao verificar estoque:', error);
            alert('Erro ao verificar disponibilidade de ingressos');
        }
    };

    const calcularTotal = () => {
        return (tiposIngresso || []).reduce((total, ingresso) => {
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

    const imageUrl = `${apiUrl}/uploads/${evento.imagem}`;
    const politicasPadrao = [
        "Reembolsos serão aceitos até 48 horas antes do evento",
        "É obrigatório apresentar um documento de identificação com foto na entrada",
        "O evento não se responsabiliza por objetos perdidos",
        "Proibida a entrada de menores de 18 anos, salvo com autorização judicial"
    ];
    const politicasDoEvento = evento.politicas && evento.politicas.length > 0 ? evento.politicas : politicasPadrao;

    const compartilharEvento = async () => {
        const url = window.location.href;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: evento?.nome || "Evento",
                    text: "Confere esse evento incrível!",
                    url: url,
                });
                console.log("Compartilhado com sucesso!");
            } catch (err) {
                console.error("Erro ao compartilhar:", err);
            }
        } else {
            navigator.clipboard.writeText(url);
            alert("Link copiado para a área de transferência!");
        }
    };

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
                                    <span className="detalhes-label"><IoTime /> Hora:</span>
                                    <span>{evento.horaInicio} - {evento.horaTermino}</span>
                                </div>
                                <div className="detalhes-info-linha">
                                    <span className="detalhes-label"><FaMapMarkerAlt /> Local:</span>
                                    <span>{evento.rua}, {evento.numero}, {evento.bairro} - {evento.cidade}, {evento.estado}</span>
                                </div>
                            </div>
                            <button className="share-button" onClick={compartilharEvento}>
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
                            {tiposIngresso?.map((ingresso, index) => (
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
                                            <button onClick={() => aumentarQuantidade(index)} disabled={ingresso.quantidade >= 8}><FiPlus /></button>
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

                {/* Bloco do criador agora utiliza os dados combinados */}
                {(criadorUsuario || criadorPerfil) ? (
                    <div className="organizador-container">
                        <h3 className="organizador-titulo">
                            <FaUserCircle /> Informações do Organizador
                        </h3>
                        <div className="organizador-conteudo">
                            <img
                                src={getCriadorImagemUrl(criadorUsuario?.imagemPerfil)}
                                alt="Foto do Criador"
                                className="organizador-avatar"
                            />
                            <div className="organizador-info">
                                {criadorUsuario?.email && (
                                    <p className="organizador-contato">
                                        <FaEnvelope /> {criadorUsuario.email}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="organizador-container organizador-erro">
                        <h3 className="organizador-titulo">
                            Informações do Criador Não Encontradas
                        </h3>
                        <p className="organizador-mensagem">
                            Não foi possível carregar os dados do criador do evento.
                            Isso pode ocorrer se o usuário não tiver um perfil completo
                            ou se houver um problema de conexão.
                        </p>
                    </div>
                )}
            </div>

            {showSuccessModal && (
                <div className="success-modal">
                    <div className="success-modal-content">
                        <span className="modal-icon">&#10004;</span>
                        <p className="modal-message">Ingressos adicionados ao carrinho!</p>
                    </div>
                </div>
            )}

            <Footer />
        </>
    );
};

export default Detalhes;