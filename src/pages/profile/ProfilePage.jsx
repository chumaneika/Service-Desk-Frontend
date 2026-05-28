import { useState } from 'react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import RoleBadge from '../../components/common/RoleBadge';
import { useAuth } from '../../hooks/useAuth';
import { getErrorMessage } from '../../utils/errors';
import { getFullName } from '../../utils/formatters';

const ProfilePage = () => {
  const { user, updateFullName, isLoading } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    surname: user?.surname || '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const updateField = (field, value) => {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!form.name.trim() || !form.surname.trim()) {
      setError('Имя и фамилия обязательны.');
      return;
    }

    try {
      await updateFullName(form);
      setSuccess('Профиль обновлен.');
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'Не удалось обновить профиль.'));
    }
  };

  return (
    <section className="page-section narrow-section">
      <div className="profile-card">
        <div className="profile-card__avatar">{getFullName(user).slice(0, 2).toUpperCase()}</div>
        <div>
          <p className="eyebrow">Профиль</p>
          <h2>{getFullName(user)}</h2>
          <p>{user.numberPhone}</p>
          <RoleBadge role={user.role} />
        </div>
      </div>

      {error && <div className="alert alert--error">{error}</div>}
      {success && <div className="alert alert--success">{success}</div>}

      <form className="card-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <Input
            label="Имя"
            name="name"
            value={form.name}
            onChange={(event) => updateField('name', event.target.value)}
          />
          <Input
            label="Фамилия"
            name="surname"
            value={form.surname}
            onChange={(event) => updateField('surname', event.target.value)}
          />
        </div>
        <div className="form-actions">
          <Button type="submit" isLoading={isLoading}>
            Сохранить
          </Button>
        </div>
      </form>
    </section>
  );
};

export default ProfilePage;

