// src/Hook/AuthContext.js

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import api from '../services/api';

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

  useEffect(() => {
    const verifySession = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          // A API precisa estar configurada para enviar o token automaticamente
          // ou você pode adicionar o header aqui.
          // Ex: api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const response = await api.get('/api/users/check-auth');

          if (response.data && response.data.user) {
            setUser(response.data.user);
          } else {
            // Token inválido, limpa tudo
            throw new Error("Sessão inválida");
          }
        }
      } catch (error) {
        console.log("Nenhuma sessão válida encontrada.", error);
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      } finally {
        setIsLoading(false);
      }
    };

    verifySession();
  }, []);

  const login = useCallback((userData: UserData, token: string) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    // O CartContext irá reagir automaticamente à mudança de 'isAuthenticated'
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post('/api/users/logout');
    } catch (error) {
      console.error("Erro ao fazer logout no backend:", error);
    } finally {
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      // Corretamente, NÃO limpamos o 'localCart' aqui,
      // para que o usuário não perca seus itens se fizer login novamente.
      window.location.href = '/login'; // Um hard refresh no logout é aceitável
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