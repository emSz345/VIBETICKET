import { Navigate, Outlet } from 'react-router-dom'; // Importe Outlet
import React from 'react';

interface RotaProtegidaProps {
  isAllowed: boolean;
  redirectPath: string;
  // `children` não é necessário quando se usa `<Outlet />` para rotas aninhadas
  // children?: React.ReactNode; // Removido ou tornado opcional se você planeja usar como rota de layout com Outlet
}

const RotaProtegida = ({ isAllowed, redirectPath }: RotaProtegidaProps) => {
  if (!isAllowed) {
    return <Navigate to={redirectPath} replace />;
  }

  // Se o usuário tem permissão, renderize o Outlet para as rotas filhas
  return <Outlet />;
};

export default RotaProtegida;
