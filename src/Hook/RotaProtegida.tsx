import { Navigate } from 'react-router-dom';
import React from 'react';

interface RotaProtegidaProps {
  isAllowed: boolean;
  redirectPath: string;
  children?: React.ReactNode;
}

const RotaProtegida = ({ isAllowed, redirectPath, children }: RotaProtegidaProps) => {
  if (!isAllowed) {
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

export default RotaProtegida;
