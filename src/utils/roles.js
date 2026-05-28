export const ROLES = {
  USER: 'USER',
  ADMIN: 'ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN',
};

export const ROLE_LABELS = {
  [ROLES.USER]: 'User',
  [ROLES.ADMIN]: 'Admin',
  [ROLES.SUPER_ADMIN]: 'Super Admin',
};

export const ROLE_DESCRIPTIONS = {
  [ROLES.USER]: 'Создает заявки и отслеживает их выполнение',
  [ROLES.ADMIN]: 'Обрабатывает заявки и управляет статусами',
  [ROLES.SUPER_ADMIN]: 'Управляет пользователями и ролями',
};

export const ROLE_HOME_PATHS = {
  [ROLES.USER]: '/dashboard',
  [ROLES.ADMIN]: '/admin/dashboard',
  [ROLES.SUPER_ADMIN]: '/super-admin/dashboard',
};

export const getHomePathByRole = (role) => ROLE_HOME_PATHS[role] || ROLE_HOME_PATHS[ROLES.USER];

export const isAdminRole = (role) => role === ROLES.ADMIN || role === ROLES.SUPER_ADMIN;

