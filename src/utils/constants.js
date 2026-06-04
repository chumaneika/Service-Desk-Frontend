import { ROLES } from './roles';

export const APP_NAME = 'Service Desk';

export const USER_NAVIGATION = [
  { label: 'Дашборд', to: '/dashboard' },
  { label: 'Мои заявки', to: '/requests' },
  { label: 'Создать заявку', to: '/requests/create' },
  { label: 'Отзывы', to: '/reviews' },
  { label: 'Профиль', to: '/profile' },
];

export const ADMIN_NAVIGATION = [
  { label: 'Дашборд', to: '/admin/dashboard' },
  { label: 'Новые заявки', to: '/admin/created-requests' },
  { label: 'Мои задачи', to: '/admin/assigned-requests' },
  { label: 'Поиск по пользователю', to: '/admin/user-requests' },
  { label: 'Отзывы', to: '/admin/reviews' },
  { label: 'Профиль', to: '/profile' },
];

export const SUPER_ADMIN_NAVIGATION = [
  { label: 'Дашборд', to: '/super-admin/dashboard' },
  { label: 'Пользователи', to: '/super-admin/users' },
  { label: 'Создать пользователя', to: '/super-admin/users/create' },
  { label: 'Поиск пользователя', to: '/super-admin/users/search' },
  { label: 'Отзывы', to: '/super-admin/reviews' },
  { label: 'Профиль', to: '/profile' },
];

export const NAVIGATION_BY_ROLE = {
  [ROLES.USER]: USER_NAVIGATION,
  [ROLES.ADMIN]: ADMIN_NAVIGATION,
  [ROLES.SUPER_ADMIN]: SUPER_ADMIN_NAVIGATION,
};

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
export const MOCK_FALLBACK_ENABLED = import.meta.env.VITE_ENABLE_MOCK_FALLBACK === 'true';
export const BOOTSTRAP_SUPER_ADMIN_PHONE = import.meta.env.VITE_BOOTSTRAP_SUPER_ADMIN_PHONE || '79640168632';
