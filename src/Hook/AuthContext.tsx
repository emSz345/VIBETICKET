import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import api from '../services/api'; // Importe sua instância central do Axios

// Interface para os dados do usuário (sem alterações)
interface UserData {
  _id: string;
  nome: string;
  email: string;
  isAdmin: boolean;
  isVerified: boolean;
  imagemPerfil?: string;
}

// Interface para o valor do nosso contexto (simplificada)
interface AuthContextType {
  isAuthenticated: boolean;
  user: UserData | null;
  isLoading: boolean;
  login: (userData: UserData) => void; // Apenas recebe os dados do usuário
  logout: () => Promise<void>; // Agora é assíncrona para chamar a API
  updateUser: (newUserData: UserData) => void;
  updateUserProfileImage: (newImageUrl: string) => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Começa como true

  // Efeito para verificar se já existe uma sessão válida no backend
  useEffect(() => {
    const verifySession = async () => {
      try {
        // O navegador envia o cookie HttpOnly automaticamente com esta chamada
        const response = await api.get('/api/users/me'); 
        
        if (response.data && response.data._id) {
          setUser(response.data);
          localStorage.setItem('user', JSON.stringify(response.data)); // Salva o user para acesso rápido
        }
      } catch (error) {
        // Se a chamada falhar (ex: 401 Unauthorized), significa que não há cookie válido
        console.log("Nenhuma sessão válida encontrada.");
        setUser(null);
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false); // Termina o carregamento
      }
    };

    verifySession();
  }, []);

  // Função de LOGIN simplificada
  const login = useCallback((userData: UserData) => {
    // A única responsabilidade desta função é atualizar o estado da aplicação
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  }, []);

  // Função de LOGOUT corrigida
  const logout = useCallback(async () => {
    try {
      // Chama a rota de logout no backend para limpar o cookie HttpOnly
      await api.post('/api/users/logout');
    } catch (error) {
      console.error("Erro ao fazer logout no backend:", error);
    } finally {
      // Limpa o estado e o localStorage no frontend, independentemente do resultado do backend
      setUser(null);
      localStorage.removeItem('user');
      // Redireciona para a página de login para garantir
      window.location.href = '/login'; 
    }
  }, []);

  // Funções de atualização do usuário (sem grandes alterações)
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

  // Memoriza o valor do contexto
  const contextValue = useMemo(() => ({
    isAuthenticated: !!user, // A autenticação é simplesmente baseada na existência do usuário
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

// Hook customizado para usar o contexto (sem alterações)
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}