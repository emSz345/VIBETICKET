import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Hook/AuthContext';
import api from '../../services/api'; // Importe sua instância do api

// Componente para mostrar um "Carregando..."
import LoadingSpinner from '../../components/ui/LoadingSpinner/LoadingSpinner';

const AuthCallback: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { login } = useAuth();

    useEffect(() => {
        const token = searchParams.get('token');

        const handleAuth = async (token: string) => {
            try {
                // 1. Salva o token no localStorage
                // (Isso é crucial para o seu 'api.ts' funcionar nas próximas requisições)
                localStorage.setItem('token', token);

                // 2. Busca os dados do usuário usando a rota /check-auth ou /me
                // A rota /check-auth é boa pois ela já busca o usuário pelo token (via cookie ou header)
                // Se o seu 'api.ts' já injeta o token do localStorage no header, isso funcionará.
                // Vamos assumir que seu api service está configurado para enviar o token.
                const response = await api.get('/api/users/check-auth');

                if (response.data && response.data.user) {
                    const { user } = response.data;

                    // 3. Atualiza o AuthContext (exatamente como no login social)
                    login(user, token);

                    // 4. Navega para a Home
                    navigate('/Home');
                } else {
                    throw new Error("Dados do usuário não retornados.");
                }

            } catch (err) {
                console.error("Falha ao autenticar após verificação:", err);
                // Limpa o token quebrado e manda para o login
                localStorage.removeItem('token');
                navigate('/login');
            }
        };

        if (token) {
            handleAuth(token);
        } else {
            // Sem token, manda para o login
            navigate('/login');
        }
    }, [searchParams, login, navigate]);

    // Mostra um feedback visual enquanto o processo ocorre
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <LoadingSpinner />
            <p style={{ marginLeft: '1rem', fontSize: '1.2rem' }}>Autenticando, aguarde...</p>
        </div>
    );
};

export default AuthCallback;