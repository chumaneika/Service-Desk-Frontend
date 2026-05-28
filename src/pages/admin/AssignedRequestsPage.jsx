import { useEffect, useState } from 'react';
import { requestApi } from '../../api/requestApi';
import Loader from '../../components/common/Loader';
import RequestTable from '../../components/requests/RequestTable';
import { useAuth } from '../../hooks/useAuth';
import { getErrorMessage } from '../../utils/errors';

const AssignedRequestsPage = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadRequests = async () => {
      setIsLoading(true);
      setError('');

      try {
        const data = await requestApi.getRequestsByResponsible(user.id);
        setRequests(data || []);
      } catch (requestError) {
        setError(getErrorMessage(requestError, 'Не удалось загрузить назначенные заявки.'));
      } finally {
        setIsLoading(false);
      }
    };

    loadRequests();
  }, [user.id]);

  return (
    <section className="page-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Assigned</p>
          <h2>Назначенные заявки</h2>
        </div>
      </div>
      {error && <div className="alert alert--error">{error}</div>}
      {isLoading ? (
        <Loader label="Загружаем задачи" />
      ) : (
        <RequestTable requests={requests} showAssignee={false} emptyTitle="Назначенных заявок нет" />
      )}
    </section>
  );
};

export default AssignedRequestsPage;

