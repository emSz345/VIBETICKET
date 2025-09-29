import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import api from '../services/api';

interface UserData {
  _id: string;
  nome: string;
  email: string;
  isAdmin: boolean;
  isVerified: boolean;
  imagemPerfil?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserData | null;
  isLoading: boolean;
  login: (userData: UserData) => void;
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
        const response = await api.get('/api/users/me'); 
        
        if (response.data && response.data._id) {
          setUser(response.data);
          localStorage.setItem('user', JSON.stringify(response.data));
          
          // Verificar se existe token no localStorage, se não, buscar da resposta
          const existingToken = localStorage.getItem('token');
          if (!existingToken && response.data.token) {
            localStorage.setItem('token', response.data.token);
          }
        }
      } catch (error) {
        console.log("Nenhuma sessão válida encontrada.");
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      } finally {
        setIsLoading(false);
      }
    };

    verifySession();
  }, []);

  const login = useCallback((userData: UserData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
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
      {!isLoading && children}
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