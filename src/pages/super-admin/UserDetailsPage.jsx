import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { userApi } from '../../api/userApi';
import EmptyState from '../../components/common/EmptyState';
import Loader from '../../components/common/Loader';
import RoleBadge from '../../components/common/RoleBadge';
import { getErrorMessage } from '../../utils/errors';
import { getFullName } from '../../utils/formatters';

const UserDetailsPage = () => {
  const { userId } = useParams();
  const [profileUser, setProfileUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadUser = async () => {
      setIsLoading(true);
      setError('');

      try {
        const data = await userApi.findUserById(userId);
        setProfileUser(data);
      } catch (requestError) {
        setError(getErrorMessage(requestError, 'Не удалось загрузить пользователя.'));
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, [userId]);

  if (isLoading) {
    return <Loader label="Загружаем пользователя" />;
  }

  if (!profileUser) {
    return <EmptyState title="Пользователь не найден" description="Проверьте ID или откройте список пользователей." />;
  }

  return (
    <section className="page-section">
      <div className="details-grid">
        <article className="details-card">
          <div className="details-card__top">
            <div>
              <p className="eyebrow">User #{profileUser.id}</p>
              <h2>{getFullName(profileUser)}</h2>
            </div>
            <RoleBadge role={profileUser.role} />
          </div>

          {error && <div className="alert alert--error">{error}</div>}

          <dl className="meta-grid meta-grid--wide">
            <div>
              <dt>Телефон</dt>
              <dd>{profileUser.numberPhone || 'Не указан'}</dd>
            </div>
            <div>
              <dt>Статус</dt>
              <dd>{profileUser.enabled ? 'Активен' : 'Отключен'}</dd>
            </div>
          </dl>
        </article>
      </div>
    </section>
  );
};

export default UserDetailsPage;
