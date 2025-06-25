// src/components/RotaProtegida.tsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../Hook/AuthContext'; // Ajuste o caminho para o seu AuthContext
import LoadingSpinner from './LoadingSpinner'; // <-- Um componente de spinner que você tenha

interface RotaProtegidaProps {
  /**
   * O caminho para redirecionar o usuário caso ele não esteja autenticado.
   * @default "/login"
   */
  redirectPath?: string;
}

const RotaProtegida = ({ redirectPath = '/login' }: RotaProtegidaProps) => {
  // Pega os estados diretamente do contexto de autenticação
  const { isAuthenticated, isLoading } = useAuth();

  // 1. Enquanto o AuthContext estiver verificando o token (isLoading === true),
  //    exibimos um componente de carregamento. Isso EVITA o redirecionamento
  //    prematuro durante o refresh da página.
  if (isLoading) {
    return <LoadingSpinner />; // ou simplesmente <div>Carregando...</div>
  }

  // 2. Após o carregamento (isLoading === false), verificamos se o usuário
  //    está de fato autenticado. Se não estiver, redirecionamos.
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  // 3. Se passou pelas verificações, o usuário está autenticado e a página pode
  //    ser renderizada através do <Outlet />.
  return <Outlet />;
};

export default RotaProtegida;