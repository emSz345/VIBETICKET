import React, { useState, useEffect } from 'react';
import { IngressoCard } from '../../components/sections/User/IngressoCard/IngresseCard';
import { QrCodeModal } from '../../components/sections/User/QrCodeModal/QrCodeModal'; // Novo componente
import '../../styles/Meus-Ingressos.css';
import { Ingresso } from '../../types/Ingresso';
import { useAuth } from '../../Hook/AuthContext';

const MeusIngressos: React.FC = () => {
    const { user, isLoading: isAuthLoading } = useAuth();
    const apiUrl = process.env.REACT_APP_API_URL;

    const [ingressos, setIngressos] = useState<Ingresso[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Estado para controlar a modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedIngresso, setSelectedIngresso] = useState<Ingresso | null>(null);
    const [isSendingEmail, setIsSendingEmail] = useState(false);

    useEffect(() => {
        const fetchIngressos = async () => {
            setLoading(true);
            setError(null);
            
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                setError("Você não está logado. Token de autenticação não encontrado.");
                return;
            }

            try {
                const response = await fetch(`${apiUrl}/api/pagamento/ingressos/user`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!response.ok) {
                    throw new Error(`Falha ao buscar ingressos. Status: ${response.status}`);
                }

                const data: Ingresso[] = await response.json();
                const ingressosMapeados = data.map(item => ({ ...item, id: item._id }));
                setIngressos(ingressosMapeados);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : "Ocorreu um erro desconhecido.";
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        if (!isAuthLoading && user) {
            fetchIngressos();
        } else if (!isAuthLoading && !user) {
            setLoading(false);
            setError("Faça login para ver seus ingressos.");
        }
    }, [user, isAuthLoading, apiUrl]);

    // Funções para controlar a modal
    const handleOpenQrModal = (ingresso: Ingresso) => {
        setSelectedIngresso(ingresso);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedIngresso(null);
    };
    
    // Função para enviar o e-mail (requer backend)
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
                throw new Error('Falha ao enviar o e-mail.');
            }

            alert('E-mail enviado com sucesso!');
            handleCloseModal();
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Ocorreu um erro desconhecido.";
            alert(`Erro: ${errorMessage}`);
        } finally {
            setIsSendingEmail(false);
        }
    };


    if (loading) {
        return <div className="meus-ingressos-carregando">Carregando seus ingressos...</div>;
    }

    return (
        <div className="meus-ingressos-pagina-meus-ingressos">
             <h2>Meus Ingressos</h2>
            {error && <div className="meus-ingressos-erro">Erro: {error}</div>}
            
            {!error && ingressos.length === 0 ? (
                <p className="meus-ingressos-mensagem-vazia">Você ainda não comprou nenhum ingresso.</p>
            ) : (
                <div className="meus-ingressos-lista-ingressos">
                    {ingressos.map((ingresso) => (
                        <IngressoCard 
                            key={ingresso.id}
                            ingresso={ingresso}
                            onOpenQrModal={() => handleOpenQrModal(ingresso)}
                        /> 
                    ))}
                </div>
            )}

            {isModalOpen && selectedIngresso && (
                <QrCodeModal 
                    ingresso={selectedIngresso}
                    onClose={handleCloseModal}
                    onSendEmail={handleSendEmail}
                    isSending={isSendingEmail}
                />
            )}
        </div>
    );
};

export default MeusIngressos;