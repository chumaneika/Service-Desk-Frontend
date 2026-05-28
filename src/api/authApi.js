import axiosClient from './axiosClient';
import { mockApi } from './mockData';
import { withMockFallback } from './mockFallback';

const normalizeAuthResponse = (data) => {
  const payload = data?.data || data;

  return {
    ...payload,
    accessToken: payload?.accessToken || payload?.access_token || payload?.token || payload?.jwt,
    refreshToken: payload?.refreshToken || payload?.refresh_token,
    userId: payload?.userId || payload?.user?.id || payload?.id,
    numberPhone: payload?.numberPhone || payload?.user?.numberPhone || payload?.phone,
  };
};

export const authApi = {
  async login({ numberPhone, password, preferredRole }) {
    return withMockFallback(
      async () => {
        const response = await axiosClient.post(
          '/api/auth/login',
          {
            numberPhone: numberPhone.trim(),
            password,
          },
          {
            skipAuth: true,
            skipRefresh: true,
          },
        );
        return normalizeAuthResponse(response.data);
      },
      () => mockApi.login({ numberPhone, preferredRole }),
    );
  },

  async refreshToken(refreshToken) {
    return withMockFallback(
      async () => {
        const response = await axiosClient.post(
          '/api/auth/refresh',
          { refreshToken },
          {
            skipAuth: true,
            skipRefresh: true,
          },
        );
        return normalizeAuthResponse(response.data);
      },
      () => mockApi.refresh(refreshToken),
    );
  },
};
