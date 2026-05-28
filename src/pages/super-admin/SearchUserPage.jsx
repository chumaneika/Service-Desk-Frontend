import { useState } from 'react';
import { requestApi } from '../../api/requestApi';
import { userApi } from '../../api/userApi';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import Input from '../../components/common/Input';
import Loader from '../../components/common/Loader';
import RoleBadge from '../../components/common/RoleBadge';
import RequestTable from '../../components/requests/RequestTable';
import { getErrorMessage } from '../../utils/errors';
import { getFullName } from '../../utils/formatters';

const SearchUserPage = () => {
  const [userId, setUserId] = useState('');
  const [foundUser, setFoundUser] = useState(null);
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
      const [user, userRequests] = await Promise.all([userApi.findUserById(userId), requestApi.getRequestsByUser(userId)]);
      setFoundUser(user);
      setRequests(userRequests || []);
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'Не удалось найти пользователя.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="page-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Search</p>
          <h2>Поиск пользователя по ID</h2>
        </div>
      </div>

      <form className="inline-form" onSubmit={handleSearch}>
        <Input
          label="User ID"
          name="userId"
          type="number"
          value={userId}
          onChange={(event) => setUserId(event.target.value)}
          placeholder="Например: 1"
        />
        <Button type="submit" isLoading={isLoading}>
          Найти
        </Button>
      </form>

      {error && <div className="alert alert--error">{error}</div>}

      {isLoading ? (
        <Loader label="Ищем пользователя" />
      ) : (
        hasSearched &&
        (foundUser ? (
          <div className="details-grid">
            <article className="details-card">
              <div className="details-card__top">
                <div>
                  <p className="eyebrow">User #{foundUser.id}</p>
                  <h2>{getFullName(foundUser)}</h2>
                </div>
                <RoleBadge role={foundUser.role} />
              </div>
              <dl className="meta-grid meta-grid--wide">
                <div>
                  <dt>Телефон</dt>
                  <dd>{foundUser.numberPhone}</dd>
                </div>
                <div>
                  <dt>Статус</dt>
                  <dd>{foundUser.enabled ? 'Активен' : 'Отключен'}</dd>
                </div>
              </dl>
            </article>

            <div>
              <div className="section-heading">
                <div>
                  <p className="eyebrow">Requests</p>
                  <h2>Заявки пользователя</h2>
                </div>
              </div>
              <RequestTable requests={requests} emptyTitle="У пользователя нет заявок" />
            </div>
          </div>
        ) : (
          <EmptyState title="Пользователь не найден" description="Проверьте ID и попробуйте снова." />
        ))
      )}
    </section>
  );
};

export default SearchUserPage;

