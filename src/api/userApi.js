import axiosClient from './axiosClient';
import { mockApi } from './mockData';
import { withMockFallback } from './mockFallback';
import { ROLES } from '../utils/roles';

const normalizeRoleParam = (role) => {
  const normalizedRole = String(role || '')
    .replace(/^ROLE_/i, '')
    .trim()
    .toUpperCase();

  return Object.values(ROLES).includes(normalizedRole) ? normalizedRole : role;
};

const normalizeUsersResponse = (data) => {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  if (Array.isArray(data?.content)) {
    return data.content;
  }

  if (Array.isArray(data?.users)) {
    return data.users;
  }

  return [];
};

export const userApi = {
  async createUser(payload) {
    return withMockFallback(
      async () => {
        const response = await axiosClient.post('/api/users', payload);
        return response.data;
      },
      () => mockApi.createUser(payload),
    );
  },

  async updateFullName(payload) {
    return withMockFallback(
      async () => {
        const response = await axiosClient.put('/api/users/full-name', payload);
        return response.data;
      },
      () => mockApi.updateFullName(payload),
    );
  },

  async findUserById(userId) {
    return withMockFallback(
      async () => {
        const response = await axiosClient.get(`/api/users/${userId}`);
        return response.data;
      },
      () => mockApi.findUserById(userId),
    );
  },

  async findAllUsers() {
    return withMockFallback(
      async () => {
        const response = await axiosClient.get('/api/users');
        return normalizeUsersResponse(response.data);
      },
      () => mockApi.findAllUsers(),
    );
  },

  async findUsersByRole(role) {
    const roleParam = normalizeRoleParam(role);

    return withMockFallback(
      async () => {
        const response = await axiosClient.get(`/api/users/by-role/${encodeURIComponent(roleParam)}`);
        return normalizeUsersResponse(response.data);
      },
      () => mockApi.findUsersByRole(roleParam),
    );
  },
};
