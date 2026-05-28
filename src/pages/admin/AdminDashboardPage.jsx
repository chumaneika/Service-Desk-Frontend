import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { requestApi } from '../../api/requestApi';
import { reviewApi } from '../../api/reviewApi';
import Loader from '../../components/common/Loader';
import RequestTable from '../../components/requests/RequestTable';
import { useAuth } from '../../hooks/useAuth';
import { getErrorMessage } from '../../utils/errors';

const AdminDashboardPage = () => {
  const { user } = useAuth();
  const [createdRequests, setCreatedRequests] = useState([]);
  const [assignedRequests, setAssignedRequests] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDashboard = async () => {
      setIsLoading(true);
      setError('');

      try {
        const [createdData, assignedData, reviewsData] = await Promise.all([
          requestApi.getCreatedRequests(),
          requestApi.getRequestsByResponsible(user.id),
          reviewApi.getAllReviews(),
        ]);

        setCreatedRequests(createdData || []);
        setAssignedRequests(assignedData || []);
        setReviews(reviewsData || []);
      } catch (requestError) {
        setError(getErrorMessage(requestError, 'Не удалось загрузить дашборд администратора.'));
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, [user.id]);

  const stats = useMemo(
    () => [
      { label: 'Новые заявки', value: createdRequests.length, to: '/admin/created-requests' },
      { label: 'Назначены мне', value: assignedRequests.length, to: '/admin/assigned-requests' },
      { label: 'Отзывы', value: reviews.length, to: '/admin/reviews' },
    ],
    [assignedRequests.length, createdRequests.length, reviews.length],
  );

  return (
    <section className="page-section">
      <div className="hero-card hero-card--admin">
        <div>
          <p className="eyebrow">ADMIN workspace</p>
          <h2>Очередь поддержки без хаоса: новые задачи, назначенные заявки и отзывы.</h2>
        </div>
      </div>

      {error && <div className="alert alert--error">{error}</div>}

      <div className="stats-grid">
        {stats.map((stat) => (
          <Link key={stat.label} className="stat-card stat-card--link" to={stat.to}>
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
          </Link>
        ))}
      </div>

      {isLoading ? (
        <Loader label="Загружаем данные" />
      ) : (
        <>
          <div className="section-heading">
            <div>
              <p className="eyebrow">Очередь</p>
              <h2>Новые заявки</h2>
            </div>
          </div>
          <RequestTable
            requests={createdRequests.slice(0, 5)}
            emptyTitle="Новых заявок нет"
            emptyDescription="Когда пользователи создадут обращения, они появятся в этой таблице."
          />
        </>
      )}
    </section>
  );
};

export default AdminDashboardPage;

