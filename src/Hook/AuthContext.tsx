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
  isLoading: boolean; // <-- NOVO ESTADO
  checkAuth: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  userData: {
    name: '',
    email: '',
    loginType: 'email',
    isAdmin: false
  },
  isLoading: true, // <-- VALOR INICIAL
  checkAuth: () => {}
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserData>({
    name: '',
    email: '',
    loginType: 'email',
    isAdmin: false
  });
  const [isLoading, setIsLoading] = useState<boolean>(true); // <-- NOVO ESTADO COM VALOR INICIAL true

  const checkAuth = useCallback(() => {
    // Para garantir que não haja "flicker", você pode manter o loading até o fim
    // setIsLoading(true); // Opcional, dependendo da UX desejada

    const token = localStorage.getItem('token') || localStorage.getItem('firebaseToken');
    const isAuth = !!token;
    
    // ... (toda a sua lógica de buscar dados do localStorage permanece a mesma)
    const newName = localStorage.getItem('userName') || '';
    const newEmail = localStorage.getItem('userEmail') || localStorage.getItem('email') || '';
    const newLoginType = (localStorage.getItem('tipoLogin') as 'email' | 'google' | 'facebook') || 'email';
    const newIsAdmin = localStorage.getItem('userRole') === 'admin';
    const newAvatarUrl = localStorage.getItem('imagemPerfil') || undefined;

    setIsAuthenticated(isAuth);

    if (isAuth) {
        setUserData({
            name: newName,
            email: newEmail,
            loginType: newLoginType,
            isAdmin: newIsAdmin,
            avatarUrl: newAvatarUrl
        });
    }

    // Ao final da verificação, independentemente do resultado, o carregamento termina.
    setIsLoading(false); // <-- INFORMA QUE A VERIFICAÇÃO TERMINOU
  }, []);

  useEffect(() => {
    checkAuth();
    // O intervalo para sincronização entre abas é uma boa ideia, mas não é necessário para a lógica de refresh.
    const interval = setInterval(checkAuth, 30000); // 30 segundos é um intervalo mais razoável
    return () => clearInterval(interval);
  }, [checkAuth]);

  const contextValue = {
    isAuthenticated,
    userData,
    isLoading, // <-- EXPOR O ESTADO NO VALOR DO CONTEXTO
    checkAuth,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);