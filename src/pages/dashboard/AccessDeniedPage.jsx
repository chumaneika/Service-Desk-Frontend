import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import { useAuth } from '../../hooks/useAuth';
import { getHomePathByRole } from '../../utils/roles';

const AccessDeniedPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const fallback = location.state?.fallback || getHomePathByRole(user?.role);

  return (
    <section className="page-section">
      <EmptyState
        title="Нет доступа"
        description="Эта страница доступна другой роли. Вернемся в безопасную зону."
      />
      <div className="centered-actions">
        <Button onClick={() => navigate(fallback)}>Вернуться на дашборд</Button>
      </div>
    </section>
  );
};

export default AccessDeniedPage;

