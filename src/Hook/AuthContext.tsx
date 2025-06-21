import { createContext, useContext, useEffect, useState } from 'react';

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

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  userData: {
    name: '',
    email: '',
    loginType: 'email',
    isAdmin: false
  },
  checkAuth: () => {}
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authState, setAuthState] = useState<AuthContextType>({
    isAuthenticated: false,
    userData: {
      name: '',
      email: '',
      loginType: 'email',
      isAdmin: false
    },
    checkAuth: () => {}
  });

  const checkAuth = () => {
    const token = localStorage.getItem('token') || localStorage.getItem('firebaseToken');
    const isAuth = !!token;
    
    setAuthState({
      isAuthenticated: isAuth,
      userData: {
        name: localStorage.getItem('userName') || '',
        email: localStorage.getItem('userEmail') || '',
        loginType: (localStorage.getItem('tipoLogin') as 'email' | 'google' | 'facebook') || 'email',
        isAdmin: localStorage.getItem('userRole') === 'admin',
        avatarUrl: localStorage.getItem('imagemPerfil') || undefined
      },
      checkAuth
    });
  };

  useEffect(() => {
    checkAuth();
    const interval = setInterval(checkAuth, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AuthContext.Provider value={authState}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);