import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestApi } from '../../api/requestApi';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import SearchBar from '../../components/common/SearchBar';
import RequestTable from '../../components/requests/RequestTable';
import { useAuth } from '../../hooks/useAuth';
import { getErrorMessage } from '../../utils/errors';

const MyRequestsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadRequests = async () => {
      setIsLoading(true);
      setError('');

      try {
        const data = await requestApi.getRequestsByUser(user.id);
        setRequests(data || []);
      } catch (requestError) {
        setError(getErrorMessage(requestError, 'Не удалось получить список заявок.'));
      } finally {
        setIsLoading(false);
      }
    };

    loadRequests();
  }, [user.id]);

  const filteredRequests = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) {
      return requests;
    }

    return requests.filter((request) =>
      [request.title, request.description, request.status, String(request.id)].some((value) =>
        value?.toLowerCase().includes(query),
      ),
    );
  }, [requests, search]);

  return (
    <section className="page-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Мои обращения</p>
          <h2>Заявки пользователя</h2>
        </div>
        <Button onClick={() => navigate('/requests/create')}>Создать заявку</Button>
      </div>

      <SearchBar value={search} onChange={setSearch} placeholder="Поиск по названию, статусу или ID" />
      {error && <div className="alert alert--error">{error}</div>}

      {isLoading ? (
        <Loader label="Загружаем заявки" />
      ) : (
        <RequestTable
          requests={filteredRequests}
          showOwner={false}
          emptyTitle="Заявки не найдены"
          emptyDescription="Попробуйте изменить поиск или создать новое обращение."
        />
      )}
    </section>
  );
};

export default MyRequestsPage;

