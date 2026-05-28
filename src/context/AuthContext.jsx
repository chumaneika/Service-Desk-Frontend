import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { authApi } from '../api/authApi';
import { userApi } from '../api/userApi';
import { BOOTSTRAP_SUPER_ADMIN_PHONE } from '../utils/constants';
import { ROLES } from '../utils/roles';
import { tokenStorage } from '../utils/tokenStorage';

export const AuthContext = createContext(null);

const normalizeRole = (role) => {
  if (!role) {
    return null;
  }

  const roleValue = typeof role === 'object' ? role.role || role.authority || role.name || role.value : role;
  const normalizedRole = String(roleValue).replace('ROLE_', '').toUpperCase();
  return Object.values(ROLES).includes(normalizedRole) ? normalizedRole : null;
};

const decodeJwtPayload = (token) => {
  if (!token || !token.includes('.')) {
    return {};
  }

  try {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const paddedPayload = payload.padEnd(payload.length + ((4 - (payload.length % 4)) % 4), '=');
    return JSON.parse(atob(paddedPayload));
  } catch {
    return {};
  }
};

const getRoleFromPayload = (payload) => {
  const candidates = [
    payload.role,
    payload.userRole,
    payload.authority,
    payload.authorities,
    payload.roles,
    payload.scope,
    payload.scopes,
    payload.permissions,
  ];

  return candidates
    .flatMap((candidate) => {
      if (!candidate) {
        return [];
      }

      if (Array.isArray(candidate)) {
        return candidate;
      }

      if (typeof candidate === 'string') {
        return candidate.split(' ');
      }

      return [candidate];
    })
    .map(normalizeRole)
    .find(Boolean);
};

const normalizePhone = (phone) => String(phone || '').replace(/[^\d]/g, '');

const normalizeAuthUser = (authResponse, preferredRole, fallbackNumberPhone) => {
  const payload = decodeJwtPayload(authResponse.accessToken);
  const numberPhone = authResponse.numberPhone || payload.numberPhone || payload.phone || fallbackNumberPhone || '';
  const isBootstrapSuperAdmin =
    BOOTSTRAP_SUPER_ADMIN_PHONE && normalizePhone(numberPhone) === normalizePhone(BOOTSTRAP_SUPER_ADMIN_PHONE);
  const role =
    normalizeRole(authResponse.role) ||
    normalizeRole(authResponse.user?.role) ||
    getRoleFromPayload(payload) ||
    (isBootstrapSuperAdmin ? ROLES.SUPER_ADMIN : null) ||
    preferredRole ||
    ROLES.USER;

  return {
    id: authResponse.userId || payload.userId || payload.id || payload.sub,
    numberPhone,
    name: authResponse.name || authResponse.user?.name || payload.name || '',
    surname: authResponse.surname || authResponse.user?.surname || payload.surname || '',
    role,
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => tokenStorage.getUser());
  const [isLoading, setIsLoading] = useState(false);
  const isAuthenticated = Boolean(user && tokenStorage.getAccessToken());

  const persistSession = useCallback((authResponse, preferredRole, fallbackNumberPhone) => {
    if (!authResponse.accessToken) {
      throw new Error('Backend не вернул access token после успешного входа.');
    }

    tokenStorage.setTokens({
      accessToken: authResponse.accessToken,
      refreshToken: authResponse.refreshToken,
    });

    const nextUser = normalizeAuthUser(authResponse, preferredRole, fallbackNumberPhone);
    tokenStorage.setUser(nextUser);
    setUser(nextUser);
    return nextUser;
  }, []);

  const login = useCallback(
    async ({ numberPhone, password, preferredRole }) => {
      setIsLoading(true);

      try {
        const authResponse = await authApi.login({ numberPhone, password, preferredRole });
        return persistSession(authResponse, preferredRole, numberPhone);
      } finally {
        setIsLoading(false);
      }
    },
    [persistSession],
  );

  const logout = useCallback(() => {
    tokenStorage.clearAll();
    setUser(null);
  }, []);

  const updateFullName = useCallback(
    async (payload) => {
      setIsLoading(true);

      try {
        const updatedUser = await userApi.updateFullName(payload);
        const nextUser = {
          ...user,
          ...payload,
          ...updatedUser,
          role: updatedUser?.role || user?.role,
        };

        tokenStorage.setUser(nextUser);
        setUser(nextUser);
        return nextUser;
      } finally {
        setIsLoading(false);
      }
    },
    [user],
  );

  useEffect(() => {
    const handleLogout = () => logout();
    window.addEventListener('auth:logout', handleLogout);

    return () => window.removeEventListener('auth:logout', handleLogout);
  }, [logout]);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated,
      login,
      logout,
      updateFullName,
    }),
    [user, isLoading, isAuthenticated, login, logout, updateFullName],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
