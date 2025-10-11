import React, { useState, useEffect } from 'react';
import { IngressoCard } from '../../components/sections/User/IngressoCard/IngresseCard';
import '../../styles/Meus-Ingressos.css';
import { Ingresso } from '../../types/Ingresso'; // Usando a interface corrigida
import { useAuth } from '../../Hook/AuthContext';

const MeusIngressos: React.FC = () => {
    const { user, isLoading } = useAuth();
    const apiUrl = process.env.REACT_APP_API_URL;

    const [ingressos, setIngressos] = useState<Ingresso[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error(`Falha ao buscar ingressos. Status: ${response.status}`);
                }

                // O TypeScript agora aceita o tipo 'Ingresso[]' com '_id'
                const data: Ingresso[] = await response.json();
                
                // Mapeia o _id retornado do Mongo para a propriedade 'id' usada no React
                const ingressosMapeados = data.map(item => ({
                    ...item,
                    id: item._id // O erro TS2339 está resolvido pois Ingresso agora tem '_id'
                }));
                
                setIngressos(ingressosMapeados);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : "Ocorreu um erro desconhecido.";
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

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
             <h2>Meus Ingressos</h2>
            {ingressos.length === 0 ? (
                <p className="meus-ingressos-mensagem-vazia">Você ainda não comprou nenhum ingresso.</p>
            ) : (
                <div className="meus-ingressos-lista-ingressos">
                    {ingressos.map((ingresso) => (
                        <IngressoCard 
                            key={ingresso.id} // Usa o 'id' mapeado
                            ingresso={ingresso} 
                        /> 
                    ))}
                </div>
            )}
        </div>
    );
};

export default MeusIngressos;