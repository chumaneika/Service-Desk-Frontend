import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getHomePathByRole } from '../utils/roles';

const DashboardRedirect = () => {
  const { user } = useAuth();

  return <Navigate to={getHomePathByRole(user?.role)} replace />;
};

export default DashboardRedirect;

