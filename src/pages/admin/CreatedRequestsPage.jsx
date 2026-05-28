import { useEffect, useState } from 'react';
import { requestApi } from '../../api/requestApi';
import Loader from '../../components/common/Loader';
import RequestTable from '../../components/requests/RequestTable';
import { getErrorMessage } from '../../utils/errors';

const CreatedRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadRequests = async () => {
      setIsLoading(true);
      setError('');

      try {
        const data = await requestApi.getCreatedRequests();
        setRequests(data || []);
      } catch (requestError) {
        setError(getErrorMessage(requestError, 'Не удалось загрузить новые заявки.'));
      } finally {
        setIsLoading(false);
      }
    };

    loadRequests();
  }, []);

  return (
    <section className="page-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">CREATED</p>
          <h2>Новые заявки</h2>
        </div>
      </div>
      {error && <div className="alert alert--error">{error}</div>}
      {isLoading ? (
        <Loader label="Загружаем заявки" />
      ) : (
        <RequestTable requests={requests} emptyTitle="Новых заявок нет" />
      )}
    </section>
  );
};

export default CreatedRequestsPage;

