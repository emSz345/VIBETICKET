// src/Hook/RotaDoUsuario.tsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Verifique se o caminho está correto

const RotaDoUsuario = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  // Se ainda estiver carregando a sessão, não renderiza nada
  if (isLoading) {
    return <div>Carregando...</div>;
  }

  // Se não está logado, redireciona para a página de login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Se o usuário logado for um admin, redireciona para o painel
  if (user?.role === 'SUPER_ADMIN' || user?.role === 'MANAGER_SITE') {
    return <Navigate to="/painel" replace />;
  }

  // Se for um usuário comum, permite o acesso à página
  return <Outlet />;
};

export default RotaDoUsuario;