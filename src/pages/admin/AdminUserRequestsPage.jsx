import { useState } from 'react';
import { requestApi } from '../../api/requestApi';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Loader from '../../components/common/Loader';
import RequestTable from '../../components/requests/RequestTable';
import { getErrorMessage } from '../../utils/errors';

const AdminUserRequestsPage = () => {
  const [userId, setUserId] = useState('');
  const [requests, setRequests] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (event) => {
    event.preventDefault();
    setError('');

    if (!userId) {
      setError('Введите ID пользователя.');
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      const data = await requestApi.getRequestsByUser(userId);
      setRequests(data || []);
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'Не удалось найти заявки пользователя.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="page-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">User requests</p>
          <h2>Поиск задач определенного пользователя</h2>
        </div>
      </div>

      <form className="inline-form" onSubmit={handleSearch}>
        <Input
          label="User ID"
          name="userId"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={userId}
          onChange={(event) => setUserId(event.target.value.replace(/\D/g, ''))}
          placeholder="Например: 1"
        />
        <Button type="submit" isLoading={isLoading}>
          Найти
        </Button>
      </form>

      {error && <div className="alert alert--error">{error}</div>}
      {isLoading ? (
        <Loader label="Ищем заявки" />
      ) : (
        hasSearched && <RequestTable requests={requests} emptyTitle="У пользователя нет заявок" />
      )}
    </section>
  );
};

export default AdminUserRequestsPage;
