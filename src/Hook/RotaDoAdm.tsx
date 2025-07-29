// src/Hook/RotaDoAdm.tsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Importe o seu hook useAuth

const AdminRoute = () => {
  // Pega as informações de usuário e autenticação DIRETAMENTE do contexto.
  const { isAuthenticated, user, isLoading } = useAuth();

  // 1. A verificação de carregamento é sempre a primeira e mais importante.
  if (isLoading) {
    return <div>Carregando...</div>; // Ou um spinner de carregamento
  }

  // 2. Verificamos se o usuário está logado E se ele é um administrador.
  // A verificação `user?.isAdmin` usa "optional chaining" para evitar erros caso `user` seja nulo.
  if (!isAuthenticated || !user?.isAdmin) {
    // Se não for um admin, redireciona para a home page (ou uma página de "acesso negado").
    return <Navigate to="/home" replace />;
  }

  // 3. Se for um admin autenticado, renderiza a rota de admin.
  return <Outlet />;
};

export default AdminRoute;