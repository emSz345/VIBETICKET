// src/components/RotaProtegida.tsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../Hook/AuthContext'; // Certifique-se de que este caminho está correto

const RotaProtegida = () => {
  // Pega os estados diretamente do contexto de autenticação.
  const { isAuthenticated, isLoading } = useAuth();

  // 1. Enquanto o AuthContext estiver verificando o token (isLoading === true),
  //    exibimos uma mensagem ou componente de carregamento.
  if (isLoading) {
    return <div>Carregando...</div>; // Você pode usar seu componente <LoadingSpinner /> aqui
  }

  // 2. Após o carregamento, se o usuário NÃO estiver autenticado, redirecionamos para /login.
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 3. Se passou pela verificação, o usuário está autenticado e a página pode ser renderizada.
  return <Outlet />;
};

export default RotaProtegida;