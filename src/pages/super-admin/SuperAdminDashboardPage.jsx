import { useEffect, useMemo, useState } from 'react';
import { requestApi } from '../../api/requestApi';
import { userApi } from '../../api/userApi';
import Loader from '../../components/common/Loader';
import RequestTable from '../../components/requests/RequestTable';
import { getErrorMessage } from '../../utils/errors';
import { ROLE_LABELS, ROLES } from '../../utils/roles';

const SuperAdminDashboardPage = () => {
  const [usersByRole, setUsersByRole] = useState({
    [ROLES.USER]: [],
    [ROLES.ADMIN]: [],
  });
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDashboard = async () => {
      setIsLoading(true);
      setError('');

      try {
        const [users, admins] = await Promise.all([
          userApi.findUsersByRole(ROLES.USER),
          userApi.findUsersByRole(ROLES.ADMIN),
        ]);
        const allUsers = [...(users || []), ...(admins || [])];
        const requestGroups = await Promise.all(
          allUsers.map((user) => requestApi.getRequestsByUser(user.id).catch(() => [])),
        );
        const allRequests = requestGroups.flat();
        const uniqueRequests = Array.from(new Map(allRequests.map((request) => [request.id, request])).values());

        setUsersByRole({
          [ROLES.USER]: users || [],
          [ROLES.ADMIN]: admins || [],
        });
        setRequests(uniqueRequests);
      } catch (requestError) {
        setError(getErrorMessage(requestError, 'Не удалось загрузить панель super admin.'));
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const stats = useMemo(
    () => [
      { label: ROLE_LABELS[ROLES.USER], value: usersByRole[ROLES.USER].length },
      { label: ROLE_LABELS[ROLES.ADMIN], value: usersByRole[ROLES.ADMIN].length },
      { label: 'Все заявки', value: requests.length },
    ],
    [requests.length, usersByRole],
  );

  return (
    <section className="page-section">
      <div className="hero-card hero-card--super">
        <div>
          <p className="eyebrow">SUPER ADMIN workspace</p>
          <h2>Панель управления пользователями, ролями и общей картиной Service Desk.</h2>
          <p>Здесь видны роли, количество пользователей и общий поток заявок.</p>
        </div>
      </div>

      {error && <div className="alert alert--error">{error}</div>}

      {isLoading ? (
        <Loader label="Загружаем данные" />
      ) : (
        <>
          <div className="stats-grid">
            {stats.map((stat) => (
              <div key={stat.label} className="stat-card">
                <span>{stat.label}</span>
                <strong>{stat.value}</strong>
              </div>
            ))}
          </div>

          <div className="section-heading">
            <div>
              <p className="eyebrow">Requests</p>
              <h2>Все заявки</h2>
            </div>
          </div>
          <RequestTable requests={requests} emptyTitle="Заявок пока нет" />
        </>
      )}
    </section>
  );
};

export default SuperAdminDashboardPage;
