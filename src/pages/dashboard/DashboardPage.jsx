import { useEffect, useState } from 'react';
import { requestApi } from '../../api/requestApi';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import Loader from '../../components/common/Loader';
import RequestCard from '../../components/requests/RequestCard';
import { useAuth } from '../../hooks/useAuth';
import { getErrorMessage } from '../../utils/errors';
import { REQUEST_STATUSES } from '../../utils/statuses';

const DashboardPage = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, completed: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDashboard = async () => {
      setIsLoading(true);
      setError('');

      try {
        const [allRequests, inProgressRequests, completedRequests] = await Promise.all([
          requestApi.getRequestsByStatus(user.id),
          requestApi.getRequestsByStatus(user.id, REQUEST_STATUSES.IN_PROGRESS),
          requestApi.getRequestsByStatus(user.id, REQUEST_STATUSES.COMPLETED),
        ]);

        setRequests(allRequests || []);
        setStats({
          total: allRequests?.length || 0,
          active: inProgressRequests?.length || 0,
          completed: completedRequests?.length || 0,
        });
      } catch (requestError) {
        setError(getErrorMessage(requestError, 'Не удалось загрузить статистику заявок.'));
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, [user.id]);

  const recentRequests = requests.slice(0, 3);

  return (
    <section className="page-section">
      <div className="hero-card">
        <div>
          <p className="eyebrow">USER workspace</p>
          <h2>Создавайте заявки и отслеживайте движение без лишнего шума.</h2>
          <p>Ваша панель показывает активные обращения, быстрый доступ к созданию и последние обновления.</p>
        </div>
        <Button to="/requests/create">Создать заявку</Button>
      </div>

      {error && <div className="alert alert--error">{error}</div>}

      <div className="stats-grid">
        <div className="stat-card">
          <span>Всего заявок</span>
          <strong>{stats.total}</strong>
        </div>
        <div className="stat-card">
          <span>В работе</span>
          <strong>{stats.active}</strong>
        </div>
        <div className="stat-card">
          <span>Завершено</span>
          <strong>{stats.completed}</strong>
        </div>
      </div>

      <div className="section-heading">
        <div>
          <p className="eyebrow">Последние заявки</p>
          <h2>Недавняя активность</h2>
        </div>
        <Button variant="secondary" to="/requests">
          Все заявки
        </Button>
      </div>

      {isLoading ? (
        <Loader label="Загружаем заявки" />
      ) : recentRequests.length ? (
        <div className="cards-grid">
          {recentRequests.map((request) => (
            <RequestCard key={request.id} request={request} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="Заявок пока нет"
          description="Создайте первую заявку, чтобы команда поддержки увидела задачу."
          actionLabel="Создать заявку"
          actionTo="/requests/create"
        />
      )}
    </section>
  );
};

export default DashboardPage;
