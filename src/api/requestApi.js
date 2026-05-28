import axiosClient from './axiosClient';
import { mockApi } from './mockData';
import { withMockFallback } from './mockFallback';
import { tokenStorage } from '../utils/tokenStorage';

const getCurrentUserId = () => tokenStorage.getUser()?.id;

export const requestApi = {
  async createRequest(payload) {
    return withMockFallback(
      async () => {
        const response = await axiosClient.post('/api/requests', payload);
        return response.data;
      },
      () => mockApi.createRequest(payload, getCurrentUserId()),
    );
  },

  async getRequestsByUser(userId) {
    return withMockFallback(
      async () => {
        const response = await axiosClient.get(`/api/requests/by-user/${userId}`);
        return response.data;
      },
      () => mockApi.getRequestsByUser(userId),
    );
  },

  async getRequestsByResponsible(userId) {
    return withMockFallback(
      async () => {
        const response = await axiosClient.get(`/api/requests/by-responsible/${userId}`);
        return response.data;
      },
      () => mockApi.getRequestsByResponsible(userId),
    );
  },

  async getCreatedRequests() {
    return withMockFallback(
      async () => {
        const response = await axiosClient.get('/api/requests/created');
        return response.data;
      },
      () => mockApi.getCreatedRequests(),
    );
  },

  async getAllRequests() {
    return withMockFallback(
      async () => {
        const response = await axiosClient.get('/api/requests');
        return response.data;
      },
      () => mockApi.getAllRequests(),
    );
  },

  async changeStatus(requestId, status) {
    return withMockFallback(
      async () => {
        const response = await axiosClient.patch(`/api/requests/${requestId}/status`, null, {
          params: { status },
        });
        return response.data;
      },
      () => mockApi.changeStatus(requestId, status),
    );
  },

  async leaveFeedback(requestId, feedback) {
    return withMockFallback(
      async () => {
        const response = await axiosClient.patch(`/api/requests/${requestId}/feedback`, null, {
          params: { feedback },
        });
        return response.data;
      },
      () => mockApi.leaveFeedback(requestId, feedback),
    );
  },

  async getRequestById(requestId) {
    return withMockFallback(
      async () => {
        const response = await axiosClient.get(`/api/requests/${requestId}`);
        return response.data;
      },
      () => mockApi.getRequestById(requestId),
    );
  },
};

