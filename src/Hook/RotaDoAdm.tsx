// src/Hook/RotaDoAdm.tsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

// 1. Definimos as propriedades que o componente vai aceitar
interface AdminRouteProps {
  allowedRoles: string[]; // Um array de strings, ex: ['SUPER_ADMIN']
}

const RotaDoAdm = ({ allowedRoles }: AdminRouteProps) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  // 2. A lógica principal agora é mais inteligente e flexível
  // Se não está autenticado OU a role do usuário NÃO ESTÁ na lista de permitidas...
  if (!isAuthenticated || !user || !allowedRoles.includes(user.role)) {
    // Redireciona para a home (ou para o painel, se preferir)
    return <Navigate to="/home" replace />;
  }

  // Se passou na verificação, permite o acesso
  return <Outlet />;
};

export default RotaDoAdm;