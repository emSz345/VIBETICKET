// Meus-Ingressos.tsx (com filtro centralizado) - ORGANIZADO
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Components
import { IngressoCard } from '../../components/sections/User/IngressoCard/IngresseCard';
import ModalAviso from '../../components/sections/User/ModalAviso/ModalAviso';
import ModalAvisoEmail from '../../components/ui/ModalAvisoEmail/ModalAvisoEmail';
import VoltarParaInicio from '../../components/layout/VoltarParaInicio/VoltarParaInicio';

// Hooks e tipos
import { useAuth } from '../../Hook/AuthContext';
import { Ingresso } from '../../types/Ingresso';

// Estilos
import '../../styles/Meus-Ingressos.css';

// TIPAGENS
type FiltroStatus = 'todos' | 'pagos' | 'pendentes' | 'reembolsados' | 'expirados';


const MeusIngressos: React.FC = () => {
    // HOOKS E CONFIGURAÇÕES
    const { user, isLoading: isAuthLoading } = useAuth();
    const apiUrl = process.env.REACT_APP_API_URL;
    const navigate = useNavigate();

    // ESTADOS
    const [modalOpen, setModalOpen] = useState(false);
    const [modalInfo, setModalInfo] = useState({ title: '', message: '' });
    
    const [modalReembolsoOpen, setModalReembolsoOpen] = useState(false);
    const [modalAvisoOpen, setModalAvisoOpen] = useState(false);
    const [modalAvisoMensagem, setModalAvisoMensagem] = useState({ title: '', message: '' });

    // Estados para dados e carregamento
    const [ingressos, setIngressos] = useState<Ingresso[]>([]);
    const [ingressosFiltrados, setIngressosFiltrados] = useState<Ingresso[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Estados para filtros
    const [filtroAtivo, setFiltroAtivo] = useState<FiltroStatus>('todos');
    const [mostrarFiltros, setMostrarFiltros] = useState(false);

    // Estados para ações
    const [isSendingEmail, setIsSendingEmail] = useState(false);
    const [isReembolsando, setIsReembolsando] = useState(false);
    const [pedidoParaReembolsar, setPedidoParaReembolsar] = useState<string | null>(null);


    // EFFECTS E INICIALIZAÇÕES
    // --- Effect para buscar ingressos --- //
    useEffect(() => {
        const fetchIngressos = async () => {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                setError("Você não está logado. Faça login para ver seus ingressos.");
                return;
            }

            try {
                const response = await fetch(`${apiUrl}/api/ingressos/user`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!response.ok) {
                    let errorMsg = `Falha ao buscar ingressos. Status: ${response.status}`;
                    try {
                        const errorData = await response.json();
                        errorMsg = errorData.error || errorMsg;
                    } catch (e) { /* Ignora erro de parsing */ }
                    throw new Error(errorMsg);
                }

                const data: Ingresso[] = await response.json();

                // Mapeia _id para id e garante que eventoId existe
                const ingressosMapeados = data.map(item => ({
                    ...item,
                    id: item._id,
                    eventoId: item.eventoId || {}
                }));
                setIngressos(ingressosMapeados);
                setIngressosFiltrados(ingressosMapeados); // Inicialmente mostra todos

            } catch (err) {
                console.error("Erro detalhado ao buscar ingressos:", err);
                setError(err instanceof Error ? err.message : "Ocorreu um erro desconhecido.");
            } finally {
                setLoading(false);
            }
        };

        if (!isAuthLoading) {
            if (user) {
                fetchIngressos();
            } else {
                setError("Faça login para ver seus ingressos.");
                setLoading(false);
            }
        }
    }, [user, isAuthLoading, apiUrl, navigate]);

    // --- Effect para filtrar ingressos --- //
    useEffect(() => {
        const filtrarIngressos = () => {
            let filtrados = ingressos;

            switch (filtroAtivo) {
                case 'pagos':
                    filtrados = ingressos.filter(ingresso => 
                        ingresso.status?.toLowerCase().includes('pago') || 
                        ingresso.status?.toLowerCase().includes('confirmado') ||
                        ingresso.status?.toLowerCase().includes('aprovado')
                    );
                    break;
                case 'pendentes':
                    filtrados = ingressos.filter(ingresso => 
                        ingresso.status?.toLowerCase().includes('pendente') ||
                        ingresso.status?.toLowerCase().includes('processando')
                    );
                    break;
                case 'reembolsados':
                    filtrados = ingressos.filter(ingresso => 
                        ingresso.status?.toLowerCase().includes('reembolsado') ||
                        ingresso.status?.toLowerCase().includes('cancelado') ||
                        ingresso.status?.toLowerCase().includes('recusado')
                    );
                    break;
                case 'expirados':
                    filtrados = ingressos.filter(ingresso => 
                        ingresso.status?.toLowerCase().includes('expirado') ||
                        ingresso.status?.toLowerCase().includes('vencido')
                    );
                    break;
                case 'todos':
                default:
                    filtrados = ingressos;
                    break;
            }

            setIngressosFiltrados(filtrados);
        };

        filtrarIngressos();
    }, [filtroAtivo, ingressos]);


    // FUNÇÕES DE FILTROS
    // --- Handler para mudança de filtro --- //
    const handleFiltroChange = (filtro: FiltroStatus) => {
        setFiltroAtivo(filtro);
        setMostrarFiltros(false);
    };


    // FUNÇÕES DE ENVIO DE EMAIL
    // --- Handler para envio de email --- //
    const handleSendEmail = async (ingressoId: string) => {
        setIsSendingEmail(true);
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${apiUrl}/api/ingressos/send-email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ ingressoId })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Falha ao enviar o e-mail.');
            }

            setModalInfo({ title: "Sucesso!", message: data.message });
            setModalOpen(true);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Ocorreu um erro";
            setModalInfo({ title: "Ops!", message: errorMessage });
            setModalOpen(true);
        } finally {
            setIsSendingEmail(false);
        }
    };


    // FUNÇÕES DE REEMBOLSO
    // --- Abre modal de confirmação de reembolso --- //
    const handleAbrirConfirmacaoReembolso = (pedidoId: string) => {
        setPedidoParaReembolsar(pedidoId);
        setModalReembolsoOpen(true);
    };

    // --- Confirma e executa o reembolso --- //
    const handleConfirmarReembolso = async () => {
        if (!pedidoParaReembolsar || isReembolsando) return;

        setIsReembolsando(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await fetch(`${apiUrl}/api/pagamento/reembolsar`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ pedidoId: pedidoParaReembolsar })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Erro ao solicitar reembolso.");
            }

            // Sucesso!
            setModalAvisoMensagem({ title: 'Sucesso', message: 'Pedido reembolsado com sucesso!' });
            setModalAvisoOpen(true);

            // Atualiza a lista local
            setIngressos(prevIngressos =>
                prevIngressos.map(ing =>
                    ing.pedidoId === pedidoParaReembolsar ? { ...ing, status: 'Reembolsado' } : ing
                )
            );

            // Fecha o modal de confirmação
            setModalReembolsoOpen(false);
            setPedidoParaReembolsar(null);

        } catch (err: any) {
            setModalAvisoMensagem({
                title: 'Reembolso Falhou',
                message: (err instanceof Error ? err.message : 'Ocorreu um erro desconhecido.')
            });
            setModalAvisoOpen(true);
            setModalReembolsoOpen(false);
        } finally {
            setIsReembolsando(false);
        }
    };


    // FUNÇÕES AUXILIARES
    // --- Contadores para os filtros --- //
    const contarIngressosPorStatus = () => {
        return {
            todos: ingressos.length,
            pagos: ingressos.filter(ing => 
                ing.status?.toLowerCase().includes('pago') || 
                ing.status?.toLowerCase().includes('confirmado') ||
                ing.status?.toLowerCase().includes('aprovado')
            ).length,
            pendentes: ingressos.filter(ing => 
                ing.status?.toLowerCase().includes('pendente') ||
                ing.status?.toLowerCase().includes('processando')
            ).length,
            reembolsados: ingressos.filter(ing => 
                ing.status?.toLowerCase().includes('reembolsado') ||
                ing.status?.toLowerCase().includes('cancelado')
            ).length,
            expirados: ingressos.filter(ing => 
                ing.status?.toLowerCase().includes('expirado') ||
                ing.status?.toLowerCase().includes('vencido')
            ).length
        };
    };

    const contadores = contarIngressosPorStatus();


    // RENDERIZAÇÃO DE ESTADOS DE CARREGAMENTO
    if (loading) {
        return <div className="meus-ingressos-carregando">Carregando seus ingressos...</div>;
    }

    if (!user && !loading) {
        return (
            <div className="pagina-meus-ingressos">
                <div className="meus-ingressos-header">
                    <h1 className="meus-ingressos-titulo">Meus Ingressos</h1>
                </div>
                <div className="meus-ingressos-erro">
                    {error || "Faça login para ver seus ingressos."}
                    <button onClick={() => navigate('/login')}>Ir para Login</button>
                </div>
            </div>
        );
    }


    // RENDERIZAÇÃO PRINCIPAL
    return (
        <>
            <VoltarParaInicio />
            <div className="pagina-meus-ingressos">
                <div className="meus-ingressos-header">
                    <h1 className="meus-ingressos-titulo">Meus Ingressos</h1>
                </div>

                {/* ============ FILTRO CENTRALIZADO ============ */}
                <div className="meus-ingressos-filtro-centralizado">
                    <div className="meus-ingressos-filtro-container">
                        <button 
                            className="meus-ingressos-botao-filtro"
                            onClick={() => setMostrarFiltros(!mostrarFiltros)}
                        >
                            <span>
                                {filtroAtivo === 'todos' ? 'Todos os ingressos' : 
                                 filtroAtivo === 'pagos' ? 'Ingressos Pagos' :
                                 filtroAtivo === 'pendentes' ? 'Ingressos Pendentes' :
                                 filtroAtivo === 'reembolsados' ? 'Ingressos Reembolsados' : 
                                 'Ingressos Expirados'}
                            </span>
                            <span className={`meus-ingressos-filtro-seta ${mostrarFiltros ? 'aberto' : ''}`}>▼</span>
                        </button>

                        {mostrarFiltros && (
                            <div className="meus-ingressos-filtro-opcoes">
                                <button 
                                    className={`meus-ingressos-filtro-opcao ${filtroAtivo === 'todos' ? 'ativo' : ''}`}
                                    onClick={() => handleFiltroChange('todos')}
                                >
                                    Todos ({contadores.todos})
                                </button>
                                <button 
                                    className={`meus-ingressos-filtro-opcao ${filtroAtivo === 'pagos' ? 'ativo' : ''}`}
                                    onClick={() => handleFiltroChange('pagos')}
                                >
                                    Pagos ({contadores.pagos})
                                </button>
                                <button 
                                    className={`meus-ingressos-filtro-opcao ${filtroAtivo === 'pendentes' ? 'ativo' : ''}`}
                                    onClick={() => handleFiltroChange('pendentes')}
                                >
                                    Pendentes ({contadores.pendentes})
                                </button>
                                <button 
                                    className={`meus-ingressos-filtro-opcao ${filtroAtivo === 'reembolsados' ? 'ativo' : ''}`}
                                    onClick={() => handleFiltroChange('reembolsados')}
                                >
                                    Reembolsados ({contadores.reembolsados})
                                </button>
                                <button 
                                    className={`meus-ingressos-filtro-opcao ${filtroAtivo === 'expirados' ? 'ativo' : ''}`}
                                    onClick={() => handleFiltroChange('expirados')}
                                >
                                    Expirados ({contadores.expirados})
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {error && user && (
                    <div className="meus-ingressos-erro">
                        Erro: {error}
                    </div>
                )}

                {!error && ingressosFiltrados.length === 0 ? (
                    <div className="meus-ingressos-mensagem-vazia">
                        {filtroAtivo === 'todos' 
                            ? "Você ainda não comprou nenhum ingresso."
                            : `Nenhum ingresso encontrado para "${filtroAtivo}".`
                        }
                    </div>
                ) : (
                    <div className="meus-ingressos-lista-ingressos">
                        {ingressosFiltrados.map((ingresso) => (
                            <IngressoCard
                                key={ingresso.id}
                                ingresso={ingresso}
                                onSendEmail={handleSendEmail}
                                isSendingEmail={isSendingEmail}
                                onReembolsar={handleAbrirConfirmacaoReembolso}
                                isReembolsando={isReembolsando}
                            />
                        ))}
                    </div>
                )}

                {/* ============ MODAIS ============ */}
                <ModalAvisoEmail
                    isOpen={modalOpen}
                    onClose={() => setModalOpen(false)}
                    title={modalInfo.title}
                    message={modalInfo.message}
                />

                <ModalAviso
                    isOpen={modalReembolsoOpen}
                    onClose={() => setModalReembolsoOpen(false)}
                    onConfirm={handleConfirmarReembolso}
                    type="confirmacao"
                    theme="perigo"
                    title="Confirmar Cancelamento"
                    labelConfirmar="Sim, Cancelar"
                    isLoading={isReembolsando}
                >
                    <p>Tem certeza que deseja cancelar este pedido?</p>
                    <p>O valor total será estornado no método de pagamento original.</p>
                </ModalAviso>

                <ModalAviso
                    isOpen={modalAvisoOpen}
                    onClose={() => setModalAvisoOpen(false)}
                    type="aviso"
                    theme={modalAvisoMensagem.title === 'Sucesso' ? 'info' : 'perigo'}
                    title={modalAvisoMensagem.title}
                >
                    <p>{modalAvisoMensagem.message}</p>
                </ModalAviso>
            </div>
        </>
    );
};

export default MeusIngressos;