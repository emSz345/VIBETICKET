// 📦 Importações principais e de ícones
import React, { useState, useEffect } from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import "../../styles/detalhes.css";
import Footer from "../../components/layout/Footer/Footer";
import {
    FaCalendarAlt,
    FaMapMarkerAlt,
    FaShareAlt,
    FaUserCircle,
    FaEnvelope,
    FaPhone,
    FaCheckCircle
} from "react-icons/fa";
import { IoTicket, IoTime } from "react-icons/io5";
import { FiMinus, FiPlus } from "react-icons/fi";
import { Evento } from "../../components/sections/Home/home-eventos/evento";
import { CarrinhoItem } from "../../types/carrinho";
import { useAuth } from "../../Hook/AuthContext";
import { useCart } from "../../Hook/CartContext";
import NavBar3 from "../../components/sections/Home/NavBar3/NavBar3";
import ChatBot from "../../components/sections/Chatbot/Chatbot";

// 🧱 Interfaces e Tipagens
interface CriadorUsuario {
    email: string;
    imagemPerfil: string;
    nome: string;
}

interface CriadorPerfil {
    dadosOrganizacao?: {
        nomeFantasia: string;
    };
    dadosPessoais?: {
        telefone: string;
    };
}

interface CriadorPopulado {
    _id: string;
    nome: string;
    email: string;
    imagemPerfil?: string;
}

interface EventoComCriador extends Omit<Evento, "criadoPor"> {
    criadoPor: string | CriadorPopulado;
    politicas: string[];
}

interface TicketType {
    tipo: string;
    valor: number;
    quantidade: number;
    descricao?: string;
}

// 🎟️ Componente principal
const Detalhes: React.FC = () => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const { id } = useParams<{ id: string }>();
    const { state } = useLocation();

    // 🔧 Contextos globais
    const { addItemToCart } = useCart();
    const { user: authUser } = useAuth();

    // ⭐ CORREÇÃO APLICADA AQUI: VERIFICAÇÃO DE ADMIN
    const isUserAdmin = authUser && (authUser.role === 'SUPER_ADMIN' || authUser.role === 'MANAGER_SITE');

    // 🔧 Estados locais
    const [evento, setEvento] = useState<EventoComCriador | null>(
        (state as EventoComCriador) || null
    );
    const [criadorUsuario, setCriadorUsuario] =
        useState<CriadorUsuario | null>(null);
    const [criadorPerfil, _setCriadorPerfil] = useState<CriadorPerfil | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [tiposIngresso, setTiposIngresso] = useState<TicketType[]>();
    const [activeTab, setActiveTab] =
        useState<"descricao" | "politicas">("descricao");
    const [eventoEncerrado, setEventoEncerrado] = useState(false);
    const [vendasEncerradas, setVendasEncerradas] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");

    // 🕓 Verifica se o evento já encerrou ou se as vendas acabaram
    useEffect(() => {
        if (evento) {
            const agora = new Date();
            const dataFimEvento = new Date(`${evento.dataFim}T${evento.horaTermino}`);
            if (agora > dataFimEvento) setEventoEncerrado(true);

            const dataFimVendas = new Date(
                `${evento.dataFimVendas}T${evento.horaInicio}`
            );
            if (agora > dataFimVendas) setVendasEncerradas(true);
        }
    }, [evento]);

    // 🖼️ Retorna a URL correta para imagem de perfil
    const getImagemPerfilUrl = (imagemPerfil?: string) => {
        if (!imagemPerfil) return `${apiUrl}/uploads/blank_profile.png`;
        if (imagemPerfil.startsWith("http")) return imagemPerfil;
        if (imagemPerfil.startsWith("/uploads")) return `${apiUrl}${imagemPerfil}`;
        if (imagemPerfil.includes("/")) return `${apiUrl}/${imagemPerfil}`;
        return `${apiUrl}/uploads/perfil-img/${imagemPerfil}`;
    };

    // 🔁 Força atualização da imagem do criador se for o mesmo usuário logado
    useEffect(() => {
        const forceUpdateImage = async () => {
            if (!evento?.criadoPor || !authUser) return;
            try {
                const criadorId =
                    typeof evento.criadoPor === "string"
                        ? evento.criadoPor
                        : (evento.criadoPor as CriadorPopulado)._id;

                if (criadorId === authUser._id) {
                    const response = await fetch(`${apiUrl}/api/users/${authUser._id}`);
                    if (response.ok) {
                        const latestUserData = await response.json();
                        if (criadorUsuario) {
                            setCriadorUsuario((prev) => ({
                                ...prev!,
                                imagemPerfil:
                                    latestUserData.imagemPerfil || prev!.imagemPerfil,
                            }));
                        } else if (evento.criadoPor && typeof evento.criadoPor === "object") {
                            const criadorPopulado = evento.criadoPor as CriadorPopulado;
                            setCriadorUsuario({
                                nome: criadorPopulado.nome,
                                email: criadorPopulado.email,
                                imagemPerfil:
                                    latestUserData.imagemPerfil ||
                                    criadorPopulado.imagemPerfil ||
                                    "",
                            });
                        }
                    }
                }
            } catch (error) {
                console.error("Erro ao atualizar imagem:", error);
            }
        };
        const timer = setTimeout(forceUpdateImage, 500);
        return () => clearTimeout(timer);
    }, [authUser, evento?.criadoPor, apiUrl, criadorUsuario]);

    // 🔍 Busca os dados do evento e do criador
    useEffect(() => {
        window.scrollTo(0, 0);
        const buscarDados = async () => {
            setIsLoading(true);
            try {
                const eventoResponse = await fetch(`${apiUrl}/api/eventos/publico/${id}`);
                if (!eventoResponse.ok) throw new Error("Evento não encontrado");
                const eventoData: EventoComCriador = await eventoResponse.json();
                setEvento(eventoData);

                // 🔹 Dados do criador
                if (eventoData.criadoPor && typeof eventoData.criadoPor === "object") {
                    const criadorPopulado = eventoData.criadoPor as CriadorPopulado;
                    const criadorData = {
                        nome: criadorPopulado.nome,
                        email: criadorPopulado.email,
                        imagemPerfil: criadorPopulado.imagemPerfil || "",
                    };
                    setCriadorUsuario(criadorData);
                }

                // 🔹 Tipos de ingresso
                const valorInteira = Number(eventoData.valorIngressoInteira) || 0;
                const valorMeia = Number(eventoData.valorIngressoMeia) || 0;
                const ingressos: TicketType[] = [
                    {
                        tipo: "Inteira",
                        valor: valorInteira,
                        quantidade: 0,
                        descricao: "Ingresso padrão para todos os públicos",
                    },
                ];
                if (eventoData.temMeia && valorMeia > 0) {
                    ingressos.push({
                        tipo: "Meia",
                        valor: valorMeia,
                        quantidade: 0,
                        descricao: "Para estudantes, idosos e PCD (com documentação)",
                    });
                }
                setTiposIngresso(ingressos);
            } catch (error) {
                console.error("Erro ao buscar dados:", error);
                setEvento(null);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) buscarDados();
    }, [id, apiUrl]);

    // ➕ Aumentar quantidade de ingressos
    const aumentarQuantidade = (index: number) => {
        setTiposIngresso((prev) =>
            (prev || []).map((ingresso, i) =>
                i === index && ingresso.quantidade < 8
                    ? { ...ingresso, quantidade: ingresso.quantidade + 1 }
                    : ingresso
            )
        );
    };

    // ➖ Diminuir quantidade de ingressos
    const diminuirQuantidade = (index: number) => {
        setTiposIngresso((prev) =>
            (prev || []).map((ingresso, i) =>
                i === index && ingresso.quantidade > 0
                    ? { ...ingresso, quantidade: ingresso.quantidade - 1 }
                    : ingresso
            )
        );
    };

    // 🛒 Adiciona ingresso ao carrinho
    const adicionarAoCarrinho = async (ingresso: TicketType) => {
        if (ingresso.quantidade === 0) {
            setModalMessage("Selecione pelo menos um ingresso.");
            setIsModalOpen(true);
            return;
        }

        try {
            const novoItem: CarrinhoItem = {
                id: `${evento?._id}-${ingresso.tipo}-${Date.now()}`,
                eventoId: evento?._id || "",
                nomeEvento: evento?.nome || "",
                tipoIngresso: ingresso.tipo,
                preco: ingresso.valor,
                quantidade: ingresso.quantidade,
                imagem: evento?.imagem || "",
                dataEvento: evento?.dataInicio || "",
                localEvento: `${evento?.rua}, ${evento?.numero}, ${evento?.bairro} - ${evento?.cidade}, ${evento?.estado}`,
            };

            await addItemToCart(novoItem);
            setModalMessage(
                `${ingresso.quantidade} ingresso(s) do tipo "${ingresso.tipo}" foram adicionados ao seu carrinho.`
            );
            setIsModalOpen(true);
        } catch (error) {
            console.error("Erro ao adicionar ao carrinho:", error);
            setModalMessage("Erro ao adicionar ingressos ao carrinho");
            setIsModalOpen(true);
        }
    };

    // Calcula o valor total dos ingressos selecionados
    const calcularTotal = () =>
        (tiposIngresso || [])
            .reduce((total, ingresso) => total + ingresso.valor * ingresso.quantidade, 0)
            .toFixed(2);

    // Compartilha o evento
    const compartilharEvento = async () => {
        const url = window.location.href;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: evento?.nome || "Evento",
                    text: "Confere esse evento incrível!",
                    url,
                });
            } catch (err) {
                console.error("Erro ao compartilhar:", err);
            }
        } else {
            navigator.clipboard.writeText(url);
            setModalMessage("Link copiado para a área de transferência!");
            setIsModalOpen(true);
        }
    };

    // Retorna dados do organizador
    const getCriadorNome = () =>
        criadorUsuario?.nome ||
        (typeof evento?.criadoPor === "object" && evento.criadoPor.nome) ||
        "Organizador";
    const getCriadorEmail = () =>
        criadorUsuario?.email ||
        (typeof evento?.criadoPor === "object" && evento.criadoPor.email) ||
        "";
    const getCriadorImagem = () =>
        criadorUsuario?.imagemPerfil ||
        (typeof evento?.criadoPor === "object" && evento.criadoPor.imagemPerfil) ||
        "";

    // Estados de carregamento e erro
    if (isLoading) return <div>Carregando evento...</div>;
    if (!evento)
        return (
            <div className="evento-nao-encontrado">
                <h2>Evento não encontrado!</h2>
                <p>Verifique o link ou volte à página inicial.</p>
            </div>
        );

    // Imagem principal e políticas padrão
    const imageUrl = `${apiUrl}/uploads/${evento.imagem}`;
    const politicasPadrao = [
        "Reembolsos até 48 horas antes do evento",
        "Obrigatório apresentar documento com foto",
        "Proibida a entrada de menores de 18 anos, salvo com autorização",
    ];
    const politicasDoEvento =
        evento.politicas && evento.politicas.length > 0
            ? evento.politicas
            : politicasPadrao;

    // 🧩 Renderização do componente
    return (
        <>
            {/* 🔔 Modal de feedback */}
            {isModalOpen && (
                <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
                    <div
                        className="Detalhes-modal-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-header">
                            <h3 className="modal-title">
                                <FaCheckCircle className="modal-icon" /> Sucesso!
                            </h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="modal-close-button"
                            >
                                &times;
                            </button>
                        </div>
                        <div className="modal-body">
                            <p>{modalMessage}</p>
                        </div>
                        <div className="modal-actions">
                            <button
                                className="btn btn-secondary"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Continuar Comprando
                            </button>
                            <Link to="/carrinho" className="btn btn-primary">
                                Ver Carrinho
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            <div className="detalhes-container">
                <NavBar3 />

                {/* 🔹 Cabeçalho do evento */}
                <div className="detalhes-header">
                    <div className="detalhes-header-content">
                        {/* ⚠️ AVISO DE INGRESSOS LIMITADOS - MOVENDO PARA O CANTO SUPERIOR DIREITO */}
                        {evento.quantidadeInteira <= 50 && (
                            <div className="aviso-ingressos-limitados">
                                <strong>
                                    Restam apenas {evento.quantidadeInteira} ingressos!
                                </strong>
                            </div>
                        )}

                        {eventoEncerrado && (
                            <div className="evento-encerrado-aviso">Evento Encerrado</div>
                        )}
                        <div className="detalhes-info-evento">
                            <h1 className="detalhes-titulo-evento">{evento.nome}</h1>

                            <div className="detalhes-meta-info">


                                <div className="detalhes-info-linha">
                                    <span className="detalhes-label">
                                        <FaCalendarAlt /> Data:
                                    </span>
                                    <span>{evento.dataInicio}</span>
                                </div>
                                <div className="detalhes-info-linha">
                                    <span className="detalhes-label">
                                        <IoTime /> Hora:
                                    </span>
                                    <span>
                                        {evento.horaInicio} - {evento.horaTermino}
                                    </span>
                                </div>
                                <div className="detalhes-info-linha">
                                    <span className="detalhes-label">
                                        <FaMapMarkerAlt /> Local:
                                    </span>
                                    <span>{`${evento.rua}, ${evento.numero}, ${evento.bairro} - ${evento.cidade}, ${evento.estado}`}</span>
                                </div>
                            </div>

                            <button className="share-button" onClick={compartilharEvento}>
                                <FaShareAlt /> Compartilhar
                            </button>
                        </div>
                        {evento.imagem && (
                            <img
                                src={imageUrl}
                                alt={evento.nome}
                                className="detalhes-imagem-evento"
                            />
                        )}
                    </div>
                </div>

                {/* 🔹 Conteúdo principal */}
                <div className="detalhes-main-content">
                    <div className="detalhes-ingressos-box">

                        {/* ⭐ CORREÇÃO APLICADA AQUI: Impede a renderização se vendas encerradas OU se for Admin */}
                        {vendasEncerradas || isUserAdmin ? (
                            <div className="vendas-encerradas-aviso">
                                <h3>
                                    <IoTicket /> {isUserAdmin ? "Acesso Restrito" : "Vendas Encerradas"}
                                </h3>
                                <p>
                                    {isUserAdmin
                                        ? "Como administrador do sistema, você não pode adicionar ingressos ao carrinho neste ambiente."
                                        : "A venda de ingressos foi encerrada."}
                                </p>
                            </div>
                        ) : (
                            <>
                                <h3 className="detalhes-title-ingresso">
                                    <IoTicket /> Escolha seus ingressos
                                </h3>
                                <div className="detalhes-ingressos-tipos">
                                    {tiposIngresso?.map((ingresso, index) => (
                                        <div key={index} className="detalhes-ingresso-card">
                                            <div className="ingresso-header">
                                                <span className="tipo">
                                                    <IoTicket /> {ingresso.tipo}
                                                </span>
                                                <span className="preco">
                                                    {ingresso.valor === 0
                                                        ? "Grátis"
                                                        : `R$ ${ingresso.valor.toFixed(2)}`}
                                                </span>
                                            </div>



                                            {ingresso.descricao && (
                                                <p className="ingresso-descricao">
                                                    {ingresso.descricao}
                                                </p>
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
                                                        disabled={ingresso.quantidade >= 8}
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
                            </>
                        )}
                    </div>

                    {/* 🔹 Abas de informações */}
                    <div className="detalhes-info-container">
                        <div className="detalhes-tabs">
                            <button
                                className={`tab-button ${activeTab === "descricao" ? "active" : ""
                                    }`}
                                onClick={() => setActiveTab("descricao")}
                            >
                                Descrição
                            </button>
                            <button
                                className={`tab-button ${activeTab === "politicas" ? "active" : ""
                                    }`}
                                onClick={() => setActiveTab("politicas")}
                            >
                                Políticas
                            </button>
                        </div>

                        <div className="detalhes-tab-content">
                            {activeTab === "descricao" ? (
                                <div className="detalhes-descricao">
                                    <p>{evento.descricao}</p>
                                </div>
                            ) : (
                                <div className="detalhes-politicas">
                                    <h3>Políticas do Evento</h3>
                                    <ul>
                                        {politicasDoEvento.map((p, i) => (
                                            <li key={i}>{p}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* 🔹 Localização e organizador */}
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

                {(criadorUsuario ||
                    (evento.criadoPor && typeof evento.criadoPor === "object")) && (
                        <div className="organizador-container">
                            <h3 className="organizador-titulo">
                                <FaUserCircle /> Informações do Organizador
                            </h3>
                            <div className="organizador-conteudo">
                                <img
                                    src={getImagemPerfilUrl(getCriadorImagem())}
                                    alt="Foto do Criador"
                                    className="organizador-avatar"
                                    onError={(e) =>
                                    ((e.target as HTMLImageElement).src =
                                        `${apiUrl}/uploads/blank_profile.png`)
                                    }
                                />
                                <div className="organizador-info">
                                    <p className="organizador-nome">{getCriadorNome()}</p>
                                    {getCriadorEmail() && (
                                        <p className="organizador-contato">
                                            <FaEnvelope /> {getCriadorEmail()}
                                        </p>
                                    )}
                                    {criadorPerfil?.dadosPessoais?.telefone && (
                                        <p className="organizador-contato">
                                            <FaPhone /> {criadorPerfil.dadosPessoais.telefone}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
            </div>

            {/* 🤖 Chatbot fixo */}
            <div
                style={{
                    display: "flex",
                    right: "20px",
                    bottom: "30px",
                    position: "fixed",
                    zIndex: "1000",
                }}
            >
                <ChatBot />
            </div>

            <Footer />
        </>
    );
};

export default Detalhes;