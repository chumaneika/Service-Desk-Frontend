import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import ThemeToggle from '../../components/common/ThemeToggle';
import { useAuth } from '../../hooks/useAuth';
import { APP_NAME } from '../../utils/constants';
import { getErrorMessage } from '../../utils/errors';
import { getHomePathByRole } from '../../utils/roles';

const LoginPage = () => {
  const { login, isLoading, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({
    numberPhone: '',
    password: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate(getHomePathByRole(user?.role), { replace: true });
    }
  }, [isAuthenticated, navigate, user?.role]);

  const updateField = (field, value) => {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!form.numberPhone.trim() || !form.password.trim()) {
      setError('Введите телефон и пароль.');
      return;
    }

    try {
      const nextUser = await login({
        ...form,
        numberPhone: form.numberPhone.trim(),
      });
      const fallbackPath = getHomePathByRole(nextUser.role);
      const redirectPath = location.state?.from?.pathname || fallbackPath;
      navigate(redirectPath, { replace: true });
    } catch (requestError) {
      if (requestError?.response?.status === 401) {
        setError('Backend отклонил вход: проверьте номер телефона, пароль и что пользователь включен в БД.');
        return;
      }

      setError(getErrorMessage(requestError, 'Не удалось войти. Проверьте данные и backend.'));
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-page__hero">
        <div className="auth-page__brand">
          <div className="sidebar__logo">SD</div>
          <span>{APP_NAME}</span>
        </div>
        <h1>Спокойный интерфейс для заявок, админов и прозрачного workflow.</h1>
        <p>
          JWT хранится локально, access token автоматически подставляется в запросы, а refresh срабатывает
          без участия пользователя.
        </p>
        <div className="auth-page__cards">
          <div>USER: создает и отслеживает заявки</div>
          <div>ADMIN: берет задачи в работу</div>
          <div>SUPER ADMIN: управляет пользователями</div>
        </div>
      </section>

      <section className="auth-card">
        <div className="auth-card__top">
          <div>
            <p className="eyebrow">Вход в систему</p>
            <h2>Service Desk</h2>
          </div>
          <ThemeToggle />
        </div>

        {error && <div className="alert alert--error">{error}</div>}

        <form className="stack" onSubmit={handleSubmit}>
          <Input
            label="Номер телефона"
            name="numberPhone"
            value={form.numberPhone}
            onChange={(event) => updateField('numberPhone', event.target.value)}
            placeholder="+79990000001"
            autoComplete="tel"
          />
          <Input
            label="Пароль"
            name="password"
            type="password"
            value={form.password}
            onChange={(event) => updateField('password', event.target.value)}
            placeholder="Введите пароль"
            autoComplete="current-password"
          />
          <Button type="submit" fullWidth isLoading={isLoading}>
            Войти
          </Button>
        </form>
      </section>
    </main>
  );
};

export default LoginPage;
