import React, { useState, useEffect } from 'react';
import { IngressoCard } from '../../components/sections/User/IngressoCard/IngresseCard';
import '../../styles/Meus-Ingressos.css';
import { Ingresso } from '../../types/Ingresso';
import { useAuth } from '../../Hook/AuthContext'; // Importe o hook de autenticação


const MeusIngressos: React.FC = () => {
    // Acesse o usuário logado para obter o ID
    const { user, isLoading } = useAuth();
    const apiUrl = process.env.REACT_APP_API_URL;

    // Estado para armazenar os ingressos buscados da API
    const [ingressos, setIngressos] = useState<Ingresso[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // useEffect para buscar os dados dos ingressos
    useEffect(() => {
        const fetchIngressos = async () => {
            if (!user?._id) {
                setLoading(false);
                setError("Usuário não logado.");
                return;
            }

            try {
                const response = await fetch(`${apiUrl}/api/compras/minhas-compras`);
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

        if (!isLoading) {
            fetchIngressos();
        }
    }, [user, isLoading, apiUrl]); // As dependências garantem que a requisição só ocorra quando o user e apiUrl estiverem prontos.

    // Tela de carregamento
    if (loading) {
        return <div className="meus-ingressos-carregando">Carregando seus ingressos...</div>;
    }

    // Tela de erro
    if (error) {
        return <div className="meus-ingressos-erro">Erro: {error}</div>;
    }

    // Renderização condicional
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
