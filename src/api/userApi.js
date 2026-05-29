import axiosClient from './axiosClient';
import { mockApi } from './mockData';
import { withMockFallback } from './mockFallback';
import { normalizePhoneForServer } from '../utils/phone';
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
    const normalizedPayload = {
      ...payload,
      numberPhone: normalizePhoneForServer(payload?.numberPhone),
    };

    return withMockFallback(
      async () => {
        const response = await axiosClient.post('/api/users', normalizedPayload);
        return response.data;
      },
      () => mockApi.createUser(normalizedPayload),
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
        const response = await axiosClient.get(`/api/users/id/${userId}`);
        return response.data;
      },
      () => mockApi.findUserById(userId),
    );
  },

  async findUserByPhone(numberPhone) {
    const normalizedNumberPhone = normalizePhoneForServer(numberPhone);

    return withMockFallback(
      async () => {
        const response = await axiosClient.get(`/api/users/numberPhone/${encodeURIComponent(normalizedNumberPhone)}`);
        return response.data;
      },
      () => mockApi.findAllUsers().find((user) => user.numberPhone === normalizedNumberPhone) || null,
    );
  },

  async searchUsers(search) {
    const normalizedSearch = String(search || '').trim();

    return withMockFallback(
      async () => {
        const response = await axiosClient.get('/api/users/search', {
          params: {
            search: normalizedSearch,
          },
        });
        return normalizeUsersResponse(response.data);
      },
      () => {
        const query = normalizedSearch.toLowerCase();
        return mockApi
          .findAllUsers()
          .filter((user) => [user.name, user.surname].some((value) => value?.toLowerCase().includes(query)));
      },
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
