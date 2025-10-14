// pages/MeusIngressos.tsx

import React, { useState, useEffect } from 'react';
import { IngressoCard } from '../../components/sections/User/IngressoCard/IngresseCard'; // Ajuste o caminho se necessário
import '../../styles/Meus-Ingressos.css';
import { Ingresso } from '../../types/Ingresso';
import { useAuth } from '../../Hook/AuthContext';
import { useNavigate } from 'react-router-dom'; // 🔥 Importar hook de navegação

const MeusIngressos: React.FC = () => {
    const { user, isLoading: isAuthLoading } = useAuth();
    const apiUrl = process.env.REACT_APP_API_URL;
    const navigate = useNavigate(); // 🔥 Hook para redirecionar

    const [ingressos, setIngressos] = useState<Ingresso[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSendingEmail, setIsSendingEmail] = useState(false); // 🔥 Controla envio de email

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
                setError(err instanceof Error ? err.message : "Ocorreu um erro.");
            } finally {
                setLoading(false);
            }
        };

        if (!isAuthLoading && user) {
            fetchIngressos();
        } else if (!isAuthLoading && !user) {
            setLoading(false);
        }
    }, [user, isAuthLoading, apiUrl]);

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

    if (loading) {
        return <div className="meus-ingressos-carregando">Carregando seus ingressos...</div>;
    }

    return (
        <div className="meus-ingressos-pagina-meus-ingressos">
            {/* 🔥 Cabeçalho da página */}
            <div className="meus-ingressos-header">
                <h1 className="meus-ingressos-titulo">Meus Ingressos</h1>
                <button className="meus-ingressos-botao-voltar" onClick={() => navigate('/')}>
                    Voltar para o Início
                </button>
            </div>

            {error && <div className="meus-ingressos-erro">Erro: {error}</div>}

            {!error && ingressos.length === 0 && !loading ? (
                <p className="meus-ingressos-mensagem-vazia">Você ainda não comprou nenhum ingresso.</p>
            ) : (
                <div className="meus-ingressos-lista-ingressos">
                    {ingressos.map((ingresso) => (
                        <IngressoCard
                            key={ingresso.id}
                            ingresso={ingresso}
                            onSendEmail={handleSendEmail}
                            isSendingEmail={isSendingEmail}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default MeusIngressos;
