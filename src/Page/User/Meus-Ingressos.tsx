// pages/MeusIngressos.tsx

import React, { useState, useEffect } from 'react';
// Ajuste o caminho se necessário e importe IngressoCard
import { IngressoCard } from '../../components/sections/User/IngressoCard/IngresseCard';
import '../../styles/Meus-Ingressos.css';
import { Ingresso } from '../../types/Ingresso'; // <-- Importe a interface atualizada
import { useAuth } from '../../Hook/AuthContext';
import ModalAviso from '../../components/sections/User/ModalAviso/ModalAviso';
import { useNavigate } from 'react-router-dom';

const MeusIngressos: React.FC = () => {
    const { user, isLoading: isAuthLoading } = useAuth();
    const apiUrl = process.env.REACT_APP_API_URL;
    const navigate = useNavigate();

    const [ingressos, setIngressos] = useState<Ingresso[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSendingEmail, setIsSendingEmail] = useState(false);

    const [isReembolsando, setIsReembolsando] = useState(false);

    const [modalReembolsoOpen, setModalReembolsoOpen] = useState(false);
    const [pedidoParaReembolsar, setPedidoParaReembolsar] = useState<string | null>(null);
    const [modalAvisoOpen, setModalAvisoOpen] = useState(false); // Para erros
    const [modalAvisoMensagem, setModalAvisoMensagem] = useState({ title: '', message: '' });

    useEffect(() => {
        const fetchIngressos = async () => {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                setError("Você não está logado. Faça login para ver seus ingressos.");
                // Opcional: Redirecionar para login
                // navigate('/login');
                return;
            }

            try {
                // A ROTA DO BACKEND JÁ DEVE ESTAR USANDO .populate('eventoId')
                const response = await fetch(`${apiUrl}/api/pagamento/ingressos/user`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!response.ok) {
                    // Tenta pegar mensagem de erro do backend
                    let errorMsg = `Falha ao buscar ingressos. Status: ${response.status}`;
                    try {
                        const errorData = await response.json();
                        errorMsg = errorData.error || errorMsg;
                    } catch (e) { /* Ignora erro de parsing */ }
                    throw new Error(errorMsg);
                }

                const data: Ingresso[] = await response.json();

                // Mapeia _id para id e garante que eventoId existe (mesmo que vazio)
                const ingressosMapeados = data.map(item => ({
                    ...item,
                    id: item._id, // Garante que 'id' exista para a key do React
                    eventoId: item.eventoId || {} // Garante que eventoId seja um objeto, mesmo se a população falhar
                }));
                setIngressos(ingressosMapeados);

            } catch (err) {
                console.error("Erro detalhado ao buscar ingressos:", err); // Log para debug
                setError(err instanceof Error ? err.message : "Ocorreu um erro desconhecido.");
            } finally {
                setLoading(false);
            }
        };

        // Roda fetchIngressos apenas se o usuário estiver carregado e logado
        if (!isAuthLoading) {
            if (user) {
                fetchIngressos();
            } else {
                setError("Faça login para ver seus ingressos.");
                setLoading(false);
                // Opcional: Redirecionar para login
                // navigate('/login');
            }
        }
    }, [user, isAuthLoading, apiUrl, navigate]); // Adicionado navigate

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

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Falha ao enviar o e-mail.');
            }

            alert('E-mail enviado com sucesso!');
        } catch (err) {
            alert(`Erro: ${err instanceof Error ? err.message : "Ocorreu um erro desconhecido."}`);
        } finally {
            setIsSendingEmail(false);
        }
    };

    const handleAbrirConfirmacaoReembolso = (pedidoId: string) => {
        setPedidoParaReembolsar(pedidoId); // Guarda o ID do pedido
        setModalReembolsoOpen(true);     // Abre o modal
    };

    // 🔥 4. FUNÇÃO QUE FAZ O REEMBOLSO (CHAMADA PELO MODAL)
    const handleConfirmarReembolso = async () => {
        if (!pedidoParaReembolsar || isReembolsando) return; // Segurança

        // REMOVIDO: o window.confirm
        // if (!window.confirm(...)) { return; }

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
            setModalAvisoOpen(true); // Mostra o modal de sucesso

            // Atualiza a lista local
            setIngressos(prevIngressos =>
                prevIngressos.map(ing =>
                    ing.pedidoId === pedidoParaReembolsar ? { ...ing, status: 'Reembolsado' } : ing
                )
            );

            // Fecha o modal de confirmação e limpa
            setModalReembolsoOpen(false);
            setPedidoParaReembolsar(null);

        } catch (err: any) {
            // 🔥 TRATAMENTO DE ERRO: Abre o modal de aviso de erro
            setModalAvisoMensagem({
                title: 'Reembolso Falhou',
                message: (err instanceof Error ? err.message : 'Ocorreu um erro desconhecido.')
            });
            setModalAvisoOpen(true);

            // Fecha o modal de confirmação mesmo se falhar
            setModalReembolsoOpen(false);
        } finally {
            setIsReembolsando(false);
        }
    };

    if (loading) {
        return <div className="meus-ingressos-carregando">Carregando seus ingressos...</div>;
    }

    // Se não estiver carregando e não tiver usuário (após verificação)
    if (!user && !loading) {
        return (
            <div className="meus-ingressos-pagina-meus-ingressos">
                <div className="meus-ingressos-header">
                    <h1 className="meus-ingressos-titulo">Meus Ingressos</h1>
                </div>
                <div className="meus-ingressos-erro">
                    {error || "Faça login para ver seus ingressos."}
                    <button onClick={() => navigate('/login')} style={{ marginLeft: '10px' }}>Login</button>
                </div>
            </div>
        );
    }

    return (
        <div className="meus-ingressos-pagina-meus-ingressos">
            <div className="meus-ingressos-header">
                <h1 className="meus-ingressos-titulo">Meus Ingressos</h1>
                <button className="meus-ingressos-botao-voltar" onClick={() => navigate('/')}>
                    Voltar para o Início
                </button>
            </div>

            {/* Exibe erro SE existir E não estiver no estado de "não logado" já tratado acima */}
            {error && user && <div className="meus-ingressos-erro">Erro: {error}</div>}

            {!error && ingressos.length === 0 ? (
                <p className="meus-ingressos-mensagem-vazia">Você ainda não comprou nenhum ingresso.</p>
            ) : (
                <div className="meus-ingressos-lista-ingressos">
                    {ingressos.map((ingresso) => (
                        <IngressoCard
                            key={ingresso.id} // Usa o 'id' que mapeamos
                            ingresso={ingresso} // Passa o objeto ingresso COMPLETO
                            onSendEmail={handleSendEmail}
                            isSendingEmail={isSendingEmail}

                            onReembolsar={handleAbrirConfirmacaoReembolso}
                            isReembolsando={isReembolsando}
                        />
                    ))}
                </div>
            )}

            <ModalAviso
                isOpen={modalReembolsoOpen}
                onClose={() => setModalReembolsoOpen(false)}
                onConfirm={handleConfirmarReembolso} // Chama a função que faz o fetch
                type="confirmacao"
                theme="perigo" // Vermelho para cancelamento
                title="Confirmar Cancelamento"
                labelConfirmar="Sim, Cancelar"
                isLoading={isReembolsando}
            >
                <p>Tem certeza que deseja cancelar este pedido?</p>
                <p>O valor total será estornado no método de pagamento original.</p>
            </ModalAviso>

            {/* Modal de Aviso (para Erros ou Sucesso) */}
            <ModalAviso
                isOpen={modalAvisoOpen}
                onClose={() => setModalAvisoOpen(false)}
                type="aviso"
                // O tema pode variar (info para sucesso, perigo para erro), mas 'perigo' cobre a maioria
                theme={modalAvisoMensagem.title === 'Sucesso' ? 'info' : 'perigo'}
                title={modalAvisoMensagem.title}
            >
                <p>{modalAvisoMensagem.message}</p>
            </ModalAviso>
        </div>
    );
};

export default MeusIngressos;