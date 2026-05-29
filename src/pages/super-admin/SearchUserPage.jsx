import { useState } from 'react';
import { userApi } from '../../api/userApi';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import Input from '../../components/common/Input';
import Loader from '../../components/common/Loader';
import RoleBadge from '../../components/common/RoleBadge';
import UserTable from '../../components/users/UserTable';
import { getErrorMessage } from '../../utils/errors';
import { getFullName } from '../../utils/formatters';

const SEARCH_MODES = {
  ID: 'id',
  PHONE: 'phone',
  NAME: 'name',
};

const SEARCH_MODE_OPTIONS = [
  { value: SEARCH_MODES.ID, label: 'ID', inputLabel: 'User ID', placeholder: 'Поиск по ID' },
  { value: SEARCH_MODES.PHONE, label: 'Телефон', inputLabel: 'Номер телефона', placeholder: 'Поиск по телефону' },
  { value: SEARCH_MODES.NAME, label: 'Имя', inputLabel: 'Имя или фамилия', placeholder: 'Поиск по имени' },
];

const SearchUserPage = () => {
  const [searchMode, setSearchMode] = useState(SEARCH_MODES.ID);
  const [searchValue, setSearchValue] = useState('');
  const [foundUser, setFoundUser] = useState(null);
  const [foundUsers, setFoundUsers] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const activeSearchMode = SEARCH_MODE_OPTIONS.find((option) => option.value === searchMode) || SEARCH_MODE_OPTIONS[0];

  const handleSearchValueChange = (event) => {
    const nextValue = event.target.value;

    if (searchMode === SEARCH_MODES.ID) {
      setSearchValue(nextValue.replace(/\D/g, ''));
      return;
    }

    setSearchValue(nextValue);
  };

  const handleSearchModeChange = (nextMode) => {
    setSearchMode(nextMode);
    setSearchValue('');
    setError('');
    setHasSearched(false);
    setFoundUser(null);
    setFoundUsers([]);
  };

  const handleSearch = async (event) => {
    event.preventDefault();
    setError('');

    if (!searchValue.trim()) {
      setError(`Введите ${activeSearchMode.inputLabel.toLowerCase()}.`);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      if (searchMode === SEARCH_MODES.NAME) {
        const users = await userApi.searchUsers(searchValue);
        setFoundUsers(users || []);
        setFoundUser(null);
        return;
      }

      const user = searchMode === SEARCH_MODES.PHONE ? await userApi.findUserByPhone(searchValue) : await userApi.findUserById(searchValue);
      setFoundUser(user);
      setFoundUsers([]);
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
          <h2>Поиск пользователя</h2>
        </div>
      </div>

      <form className="search-panel" onSubmit={handleSearch}>
        <div className="segmented-control" aria-label="Тип поиска пользователя">
          {SEARCH_MODE_OPTIONS.map((option) => (
            <button
              aria-pressed={searchMode === option.value}
              className={`segmented-control__button ${
                searchMode === option.value ? 'segmented-control__button--active' : ''
              }`}
              key={option.value}
              onClick={() => handleSearchModeChange(option.value)}
              type="button"
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="search-panel__row">
          <Input
            label={activeSearchMode.inputLabel}
            name="userSearch"
            type="text"
            inputMode={searchMode === SEARCH_MODES.ID ? 'numeric' : searchMode === SEARCH_MODES.PHONE ? 'tel' : 'text'}
            pattern={searchMode === SEARCH_MODES.ID ? '[0-9]*' : undefined}
            value={searchValue}
            onChange={handleSearchValueChange}
            placeholder={activeSearchMode.placeholder}
          />
          <Button type="submit" isLoading={isLoading}>
            Найти
          </Button>
        </div>
      </form>

      {error && <div className="alert alert--error">{error}</div>}

      {isLoading ? (
        <Loader label="Ищем пользователя" />
      ) : (
        hasSearched &&
        (searchMode === SEARCH_MODES.NAME ? (
          <UserTable users={foundUsers} emptyTitle="Пользователи не найдены" />
        ) : foundUser ? (
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
          </div>
        ) : (
          <EmptyState title="Пользователь не найден" description="Проверьте ID и попробуйте снова." />
        ))
      )}
    </section>
  );
};

export default SearchUserPage;
