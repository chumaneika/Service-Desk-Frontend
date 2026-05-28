import { useState } from 'react';
import { userApi } from '../../api/userApi';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import RoleBadge from '../../components/common/RoleBadge';
import Select from '../../components/common/Select';
import { getErrorMessage } from '../../utils/errors';
import { ROLE_LABELS, ROLES } from '../../utils/roles';

const roleOptions = Object.values(ROLES).map((role) => ({
  value: role,
  label: ROLE_LABELS[role],
}));

const initialForm = {
  name: '',
  surname: '',
  numberPhone: '',
  password: '',
  role: ROLES.USER,
};

const CreateUserPage = () => {
  const [form, setForm] = useState(initialForm);
  const [createdUser, setCreatedUser] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const updateField = (field, value) => {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setCreatedUser(null);

    if (!form.numberPhone.trim() || !form.password.trim() || !form.role) {
      setError('Телефон, пароль и роль обязательны.');
      return;
    }

    setIsSubmitting(true);

    try {
      const user = await userApi.createUser(form);
      setCreatedUser(user);
      setForm(initialForm);
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'Не удалось создать пользователя.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="page-section narrow-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Create user</p>
          <h2>Создать пользователя или администратора</h2>
        </div>
      </div>

      {error && <div className="alert alert--error">{error}</div>}
      {createdUser && (
        <div className="alert alert--success">
          Пользователь #{createdUser.id} создан. <RoleBadge role={createdUser.role} />
        </div>
      )}

      <form className="card-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <Input
            label="Имя"
            name="name"
            value={form.name}
            onChange={(event) => updateField('name', event.target.value)}
            placeholder="Введите имя"
          />
          <Input
            label="Фамилия"
            name="surname"
            value={form.surname}
            onChange={(event) => updateField('surname', event.target.value)}
            placeholder="Введите фамилию"
          />
        </div>
        <Input
          label="Номер телефона"
          name="numberPhone"
          value={form.numberPhone}
          onChange={(event) => updateField('numberPhone', event.target.value)}
          placeholder="+79990000001"
        />
        <Input
          label="Пароль"
          name="password"
          type="password"
          value={form.password}
          onChange={(event) => updateField('password', event.target.value)}
          placeholder="Временный пароль"
        />
        <Select
          label="Роль"
          name="role"
          value={form.role}
          onChange={(event) => updateField('role', event.target.value)}
          options={roleOptions}
        />
        <div className="form-actions">
          <Button type="submit" isLoading={isSubmitting}>
            Создать пользователя
          </Button>
        </div>
      </form>
    </section>
  );
};

export default CreateUserPage;
