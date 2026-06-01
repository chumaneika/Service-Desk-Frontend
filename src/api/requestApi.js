import axiosClient from './axiosClient';
import { mockApi } from './mockData';
import { withMockFallback } from './mockFallback';
import { tokenStorage } from '../utils/tokenStorage';

const getCurrentUserId = () => tokenStorage.getUser()?.id;

const normalizeRequest = (request) => {
  if (!request) {
    return request;
  }

  return {
    ...request,
    assignedTo: request.assignedTo || request.responsible || null,
  };
};

const normalizeRequests = (requests) => (Array.isArray(requests) ? requests.map(normalizeRequest) : requests);

export const requestApi = {
  async createRequest(payload) {
    const createdById = getCurrentUserId();
    const requestPayload = {
      ...payload,
      createdById,
    };

    return withMockFallback(
      async () => {
        const response = await axiosClient.post('/api/requests', requestPayload);
        return normalizeRequest(response.data);
      },
      () => mockApi.createRequest(requestPayload, createdById),
    );
  },

  async getRequestsByUser(userId) {
    return withMockFallback(
      async () => {
        const response = await axiosClient.get(`/api/requests/by-user/${userId}`);
        return normalizeRequests(response.data);
      },
      () => mockApi.getRequestsByUser(userId),
    );
  },

  async getRequestsByStatus(userId, status = null) {
    return withMockFallback(
      async () => {
        const response = await axiosClient.get(`/api/requests/by-status/${userId}`, {
          params: status ? { status } : {},
        });
        return normalizeRequests(response.data);
      },
      () => {
        const requests = mockApi.getRequestsByUser(userId);
        return status ? requests.filter((request) => request.status === status) : requests;
      },
    );
  },

  async getRequestsByResponsible(userId) {
    return withMockFallback(
      async () => {
        const response = await axiosClient.get(`/api/requests/by-responsible/${userId}`);
        return normalizeRequests(response.data);
      },
      () => mockApi.getRequestsByResponsible(userId),
    );
  },

  async getCreatedRequests() {
    return withMockFallback(
      async () => {
        const response = await axiosClient.get('/api/requests/created');
        return normalizeRequests(response.data);
      },
      () => mockApi.getCreatedRequests(),
    );
  },

  async getAllRequests() {
    return withMockFallback(
      async () => {
        const response = await axiosClient.get('/api/requests');
        return normalizeRequests(response.data);
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
        return normalizeRequest(response.data);
      },
      () => mockApi.changeStatus(requestId, status),
    );
  },

  async assignResponsible(requestId, userId) {
    return withMockFallback(
      async () => {
        const response = await axiosClient.patch(`/api/requests/${requestId}/responsible/${userId}`);
        return normalizeRequest(response.data);
      },
      () => mockApi.assignResponsible(requestId, userId),
    );
  },

  async leaveFeedback(requestId, feedback) {
    return withMockFallback(
      async () => {
        const response = await axiosClient.patch(`/api/requests/${requestId}/feedback`, null, {
          params: { feedback },
        });
        return normalizeRequest(response.data);
      },
      () => mockApi.leaveFeedback(requestId, feedback),
    );
  },

  async getRequestById(requestId) {
    return withMockFallback(
      async () => {
        const response = await axiosClient.get(`/api/requests/${requestId}`);
        return normalizeRequest(response.data);
      },
      () => mockApi.getRequestById(requestId),
    );
  },
};
