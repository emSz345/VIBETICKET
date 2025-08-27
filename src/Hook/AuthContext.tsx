import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import axios from 'axios';

// Interface para os dados do usuário
interface UserData {
  _id: string;
  nome: string;
  email: string;
  isAdmin: boolean;
  isVerified: boolean;
  imagemPerfil?: string;
}

// Interface para os dados do login social
interface SocialLoginData {
  provider: 'google' | 'facebook';
  userData: UserData;
  token: string;
}

// Interface para o valor do nosso contexto
interface AuthContextType {
  isAuthenticated: boolean;
  user: UserData | null;
  isLoading: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
  updateUser: (newUserData: UserData) => void;
  socialLogin: (data: SocialLoginData) => void;
}

// Criação do contexto
const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// Componente Provedor
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(() => {
    try {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');

      // Se não houver token, retorna null mesmo que tenha user
      if (!token) return null;

      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem('token');
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Efeito para carregar dados do usuário na inicialização do app
  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      const storedUserString = localStorage.getItem('user');
      const isAdmin = localStorage.getItem('isAdmin') === 'true';
      if (token && storedUserString) {
        const storedUser = JSON.parse(storedUserString);
        setUser({
          ...storedUser,
          isAdmin // Garanta que isAdmin é carregado corretamente
        });
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Falha ao carregar dados do usuário do localStorage", error);
      setUser(null);
      setIsAuthenticated(false);
      localStorage.clear();
    } finally {
      setIsLoading(false);
    }
  }, []);

  // --- Funções de manipulação de estado ---
  
  // Envolve a função logout com useCallback
  const logout = useCallback(() => {
    localStorage.clear();
    setUser(null);
    setIsAuthenticated(false);
  }, [setUser, setIsAuthenticated]);

  // Envolve a função login com useCallback
  const login = useCallback(async (email: string, senha: string) => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      const response = await axios.post(`${apiUrl}/api/users/login`, { email, senha });
      const { token, user: userData } = response.data;

      if (!token) {
        throw new Error('Token não recebido do servidor');
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("isAdmin", userData.isAdmin.toString());
      localStorage.setItem("isAuthenticated", "true");
      setUser(userData);
      setIsAuthenticated(true);

      console.log("✅ [AuthContext] Estado atualizado! Autenticado:", true, "Usuário:", userData);
    } catch (error) {
      console.error("Falha no login:", error);
      // Chama o logout diretamente sem a necessidade de envolver
      // em useCallback, pois será um valor constante
      logout(); 
      throw error;
    }
  }, [logout, setUser, setIsAuthenticated]);

  // Envolve a função socialLogin com useCallback
  const socialLogin = useCallback((data: SocialLoginData) => {
    const existingLocalImage = localStorage.getItem('hasLocalImage');

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.userData));
    localStorage.setItem("userName", data.userData.nome);
    localStorage.setItem("userEmail", data.userData.email);
    localStorage.setItem("userRole", data.userData.isAdmin ? "admin" : "user");
    if (!existingLocalImage) {
      localStorage.setItem("imagemPerfil", data.userData.imagemPerfil || "");
    }
    localStorage.setItem("isAdmin", data.userData.isAdmin.toString());
    localStorage.setItem("isVerified", "true");
    setUser(data.userData);
    setIsAuthenticated(true);
  }, [setUser, setIsAuthenticated]);

  // Envolve a função updateUser com useCallback
  const updateUser = useCallback((newUserData: UserData) => {
    setUser(newUserData);
    localStorage.setItem('user', JSON.stringify(newUserData));
  }, [setUser]);

  // Memorizando o valor do contexto para evitar renderizações desnecessárias
  const contextValue = useMemo(() => ({
    isAuthenticated,
    user,
    isLoading,
    login,
    logout,
    updateUser,
    socialLogin
  }), [isAuthenticated, user, isLoading, login, logout, updateUser, socialLogin]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook customizado para usar o contexto
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}
