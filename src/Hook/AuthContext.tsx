import { createContext, useContext, useEffect, useState, useCallback } from 'react';

interface UserData {
  name: string;
  email: string;
  loginType: 'email' | 'google' | 'facebook';
  isAdmin: boolean;
  avatarUrl?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  userData: UserData;
  checkAuth: () => void;
}

// Valor padrão para o contexto
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  userData: {
    name: '',
    email: '',
    loginType: 'email',
    isAdmin: false
  },
  checkAuth: () => { /* Vazio, será sobrescrito pelo Provider */ }
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserData>({
    name: '',
    email: '',
    loginType: 'email',
    isAdmin: false
  });

  // A função checkAuth agora é completamente estável, sem dependências
  const checkAuth = useCallback(() => {
    const token = localStorage.getItem('token') || localStorage.getItem('firebaseToken');
    const isAuth = !!token;
    
    const newName = localStorage.getItem('userName') || '';
    const newEmail = localStorage.getItem('userEmail') || '';
    const newLoginType = (localStorage.getItem('tipoLogin') as 'email' | 'google' | 'facebook') || 'email';
    const newIsAdmin = localStorage.getItem('userRole') === 'admin';
    const newAvatarUrl = localStorage.getItem('imagemPerfil') || undefined;

    // Usando forma funcional para setIsAuthenticated
    setIsAuthenticated(prevIsAuth => {
      if (isAuth !== prevIsAuth) {
        return isAuth;
      }
      return prevIsAuth; // Retorna o estado anterior se não houver mudança real
    });

    // Crie um novo objeto de dados do usuário
    const newUserData = {
      name: newName,
      email: newEmail,
      loginType: newLoginType,
      isAdmin: newIsAdmin,
      avatarUrl: newAvatarUrl
    };

    // Usando forma funcional para setUserData e comparando com o estado anterior
    setUserData(prevUserData => {
      // Comparação superficial para ver se o userData realmente mudou
      if (
        newUserData.name !== prevUserData.name ||
        newUserData.email !== prevUserData.email ||
        newUserData.loginType !== prevUserData.loginType ||
        newUserData.isAdmin !== prevUserData.isAdmin ||
        newUserData.avatarUrl !== prevUserData.avatarUrl
      ) {
        return newUserData;
      }
      return prevUserData; // Retorna o objeto anterior se não houver mudança real
    });
  }, []); // Array de dependências vazio: esta função nunca será recriada

  // Este useEffect executa checkAuth na montagem do componente
  // e configura um intervalo para verificar a autenticação periodicamente.
  // A dependência `checkAuth` é segura aqui porque `useCallback` a tornou estável.
  useEffect(() => {
    checkAuth();
    const interval = setInterval(checkAuth, 30000); // Verifica a cada 30 segundos
    return () => clearInterval(interval); // Limpa o intervalo ao desmontar o componente
  }, [checkAuth]); // checkAuth é uma dependência, mas agora é estável devido ao useCallback

  const contextValue = {
    isAuthenticated,
    userData,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
