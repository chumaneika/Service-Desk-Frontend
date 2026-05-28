import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getHomePathByRole } from '../utils/roles';

const RoleRoute = ({ allowedRoles, children }) => {
  const { user } = useAuth();

  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to="/access-denied" replace state={{ fallback: getHomePathByRole(user?.role) }} />;
  }

  return children || <Outlet />;
};

export default RoleRoute;

