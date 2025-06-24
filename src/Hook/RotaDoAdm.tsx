// src/Hook/RotaDoAdm.tsx

import { Navigate, Outlet } from 'react-router-dom';
import React from 'react'; // Import React if you haven't already

interface AdminRouteProps {
    isAdmin: boolean;
    redirectPath?: string; // <--- ADICIONE ESTA LINHA
}

const AdminRoute: React.FC<AdminRouteProps> = ({
    isAdmin,
    redirectPath = '/home', // <--- USE O redirectPath, com um valor padrão
}) => {
    if (!isAdmin) {
        return <Navigate to={redirectPath} replace />;
    }

    return <Outlet />;
};

export default AdminRoute;