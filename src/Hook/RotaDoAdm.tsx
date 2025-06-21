// components/AdminRoute.tsx
import RotaProtegida from './RotaProtegida'

interface AdminRouteProps {
  isAdmin: boolean;
  children?: React.ReactNode;
}

const AdminRoute = ({ isAdmin, children }: AdminRouteProps) => {
  return (
    <RotaProtegida isAllowed={isAdmin} redirectPath="/home">
      {children}
    </RotaProtegida>
  );
};


export default AdminRoute;