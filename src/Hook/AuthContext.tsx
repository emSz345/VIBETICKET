import React, { createContext, useContext, useEffect, useState, useMemo } from 'react'; // 1. IMPORTAMOS O useMemo
import axios from 'axios';


// Interface para os dados do usuário
interface UserData {
  _id: string;
  nome: string;
  email: string;
  isAdmin: boolean;
  imagemPerfil?: string;
}

// Interface para o valor do nosso contexto
interface AuthContextType {
  isAuthenticated: boolean;
  user: UserData | null;
  isLoading: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
  updateUser: (newUserData: UserData) => void;
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

      if (token && storedUserString) {
        const storedUser = JSON.parse(storedUserString);
        setUser(storedUser);
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

  const login = async (email: string, senha: string) => {
    try {
      const response = await axios.post("http://localhost:5000/api/users/login", { email, senha });
      const { token, user: userData } = response.data;
    
      //chaves antigas 
     

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      

      setUser(userData);
      setIsAuthenticated(true);

      console.log("✅ [AuthContext] Estado atualizado! Autenticado:", true, "Usuário:", userData);
      return userData; // Adicione este retorno
    } catch (error) {
      console.error("Falha no login:", error);
      logout();
      throw error;
    }
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = (newUserData: UserData) => {
    setUser(newUserData);
    localStorage.setItem('user', JSON.stringify(newUserData));
  };

  // 2. A VARIÁVEL `contextValue` AGORA É "MEMORIZADA"
  // O React só vai recriar este objeto se um dos itens no array de dependências mudar.
  const contextValue = useMemo(() => ({
    isAuthenticated,
    user,
    isLoading,
    login,
    logout,
    updateUser,
  }), [isAuthenticated, user, isLoading]); // Array de dependências

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook customizado para usar o contexto
export const useAuth = () => useContext(AuthContext);