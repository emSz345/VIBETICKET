// src/Hook/AuthContext.tsx

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import api from '../services/api'; // Certifique-se de que este 'api' tem withCredentials: true
import axios, { AxiosError } from 'axios'; // Importa AxiosError para tratamento de erro

interface UserData {
    _id: string;
    nome: string;
    email: string;
    role: string;
    isVerified: boolean;
    imagemPerfil?: string;
    mercadoPagoAccountId?: string | null;
}

interface AuthContextType {
    isAuthenticated: boolean;
    user: UserData | null;
    isLoading: boolean;
    login: (userData: UserData, token: string) => void;
    logout: () => Promise<void>;
    updateUser: (newUserData: UserData) => void;
    updateUserProfileImage: (newImageUrl: string) => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<UserData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // =================================================================
    // 🔥 CORREÇÃO: Função de verificação de sessão
    // =================================================================
    useEffect(() => {
        const verifySession = async () => {
            try {
                const token = localStorage.getItem('token');

                // Se não houver token no localStorage, não há sessão para verificar
                if (!token) {
                    throw new Error("Token ausente no localStorage");
                }

                // Tenta verificar a sessão, enviando o token do localStorage
                // explicitamente via cabeçalho 'Authorization' como principal método
                // de autenticação para esta rota, já que o cookie pode estar falhando.
                const response = await api.get('/api/users/check-auth', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.data && response.data.user) {
                    setUser(response.data.user);
                } else {
                    // Resposta 200, mas sem dados de usuário = falha na verificação
                    throw new Error("Resposta de verificação de sessão inválida");
                }
            } catch (error) {
                // Linha onde o erro 401 é capturado. 
                // Usamos AxiosError para identificar o 401 com mais clareza.
                if (axios.isAxiosError(error)) {
                    const axiosError = error as AxiosError;
                    // Loga o erro específico (401, 403, etc.)
                    console.error("❌ Falha na verificação de sessão:", axiosError.response?.status, axiosError.message);
                } else {
                    console.error("❌ Nenhuma sessão válida encontrada.", error);
                }

                // Limpa o estado e o armazenamento local em caso de falha
                setUser(null);
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            } finally {
                setIsLoading(false);
            }
        };

        verifySession();
    }, []);

    // =================================================================
    // Funções de Gerenciamento de Estado (Mantidas)
    // =================================================================

    const login = useCallback((userData: UserData, token: string) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', token);
    }, []);

    const logout = useCallback(async () => {
        try {
            // Remove do localStorage PRIMEIRO
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            // Depois chama o backend
            await api.post('/api/users/logout');
        } catch (error) {
            console.error("Erro ao fazer logout no backend:", error);
            // Continua mesmo com erro no backend
        } finally {
            // Garante que o estado seja limpo
            setUser(null);
            localStorage.removeItem('user');
            localStorage.removeItem('token');

            // Redireciona forçadamente
            window.location.href = '/login';
        }
    }, []);

    const updateUser = useCallback((newUserData: UserData) => {
        setUser(newUserData);
        localStorage.setItem('user', JSON.stringify(newUserData));
    }, []);

    const updateUserProfileImage = useCallback((newImageUrl: string) => {
        setUser(prevUser => {
            if (!prevUser) return null;
            const updatedUser = { ...prevUser, imagemPerfil: newImageUrl };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            return updatedUser;
        });
    }, []);

    // =================================================================
    // Context Value (Mantido)
    // =================================================================

    const contextValue = useMemo(() => ({
        isAuthenticated: !!user,
        user,
        isLoading,
        login,
        logout,
        updateUser,
        updateUserProfileImage,
    }), [user, isLoading, login, logout, updateUser, updateUserProfileImage]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth deve ser usado dentro de um AuthProvider");
    }
    return context;
}
