import React, { useState, useEffect } from 'react';
import { IngressoCard } from '../../components/sections/User/IngressoCard/IngresseCard';
import '../../styles/Meus-Ingressos.css';
import { Ingresso } from '../../types/Ingresso';
import { useAuth } from '../../Hook/AuthContext';


const MeusIngressos: React.FC = () => {
    const { user, isLoading } = useAuth();
    const apiUrl = process.env.REACT_APP_API_URL;

    const [ingressos, setIngressos] = useState<Ingresso[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchIngressos = async () => {

            const token = localStorage.getItem('token');

            // CORREÇÃO: Remova a verificação de '!user' aqui. 
            // A verificação '!isLoading' logo abaixo já garante que o estado de auth está pronto.
            if (!token) {
                setLoading(false);
                setError("Usuário não logado. Token de autenticação não encontrado.");
                return;
            }

            try {
                const response = await fetch(`${apiUrl}/api/compras/minhas-compras`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error("Erro ao buscar ingressos.");
                }

                const data: Ingresso[] = await response.json();
                setIngressos(data);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("Ocorreu um erro desconhecido.");
                }
            } finally {
                setLoading(false);
            }
        };

        // Essa verificação é a mais importante. Ela garante que a função só roda quando o useAuth terminar de carregar.
        if (!isLoading) {
            fetchIngressos();
        }
    }, [user, isLoading, apiUrl]);

    if (loading) {
        return <div className="meus-ingressos-carregando">Carregando seus ingressos...</div>;
    }

    if (error) {
        return <div className="meus-ingressos-erro">Erro: {error}</div>;
    }

    return (
        <div className="meus-ingressos-pagina-meus-ingressos">
            {ingressos.length === 0 ? (
                <p className="meus-ingressos-mensagem-vazia">Você ainda não comprou nenhum ingresso.</p>
            ) : (
                <div className="meus-ingressos-lista-ingressos">
                    {ingressos.map((ingresso) => (
                        <IngressoCard key={ingresso.id} ingresso={ingresso} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default MeusIngressos;
