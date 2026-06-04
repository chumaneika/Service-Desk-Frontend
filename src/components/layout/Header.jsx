import { useLocation } from 'react-router-dom';
import { getFullName } from '../../utils/formatters';
import Button from '../common/Button';
import ThemeToggle from '../common/ThemeToggle';

const TITLES = {
  '/dashboard': 'Dashboard',
  '/requests': 'Мои заявки',
  '/requests/create': 'Новая заявка',
  '/reviews': 'Отзывы',
  '/profile': 'Профиль',
  '/admin/dashboard': 'Дашборд администратора',
  '/admin/created-requests': 'Новые заявки',
  '/admin/assigned-requests': 'Назначенные заявки',
  '/admin/user-requests': 'Поиск заявок',
  '/admin/reviews': 'Отзывы',
  '/super-admin/dashboard': 'Super Admin',
  '/super-admin/users': 'Пользователи',
  '/super-admin/users/create': 'Создать пользователя',
  '/super-admin/users/search': 'Поиск пользователя',
  '/super-admin/reviews': 'Отзывы',
};

const getHeaderTitle = (pathname) => {
  if (TITLES[pathname]) {
    return TITLES[pathname];
  }

  if (pathname.startsWith('/super-admin/users/')) {
    return 'Пользователь';
  }

  return 'Service Desk';
};

const Header = ({ user, onMenuClick, onLogout }) => {
  const location = useLocation();
  const title = getHeaderTitle(location.pathname);

  return (
    <header className="header">
      <div className="header__left">
        <button className="header__menu" type="button" onClick={onMenuClick} aria-label="Открыть меню">
          <span />
          <span />
        </button>
        <div>
          <p className="eyebrow">Workspace</p>
          <h1>{title}</h1>
        </div>
      </div>

      <div className="header__actions">
        <ThemeToggle />
        <div className="header__user">
          <strong>{getFullName(user)}</strong>
          <span>{user?.numberPhone}</span>
        </div>
        <Button variant="ghost" size="sm" onClick={onLogout}>
          Выйти
        </Button>
      </div>
    </header>
  );
};

export default Header;
