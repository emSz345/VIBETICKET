// src/Hook/RotaDoAdm.tsx

import { Navigate, Outlet } from 'react-router-dom';
import React from 'react';

interface AdminRouteProps {
    isAdmin: boolean;
    redirectPath?: string;
}

const AdminRoute: React.FC<AdminRouteProps> = ({
    isAdmin,
    redirectPath = '/home',
}) => {
    if (!isAdmin) {
        return <Navigate to={redirectPath} replace />;
    }

    return <Outlet />; // Já está usando Outlet corretamente
};

export default AdminRoute;
