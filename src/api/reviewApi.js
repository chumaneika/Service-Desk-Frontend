import axiosClient from './axiosClient';
import { mockApi } from './mockData';
import { withMockFallback } from './mockFallback';
import { tokenStorage } from '../utils/tokenStorage';

const getCurrentUserId = () => tokenStorage.getUser()?.id;

export const reviewApi = {
  async createReview(payload) {
    return withMockFallback(
      async () => {
        const response = await axiosClient.post('/api/reviews', payload);
        return response.data;
      },
      () => mockApi.createReview(payload, getCurrentUserId()),
    );
  },

  async getAllReviews() {
    return withMockFallback(
      async () => {
        const response = await axiosClient.get('/api/reviews');
        return response.data;
      },
      () => mockApi.getAllReviews(),
    );
  },

  async getReviewsByOwner(ownerId) {
    return withMockFallback(
      async () => {
        const response = await axiosClient.get(`/api/reviews/owner/${ownerId}`);
        return response.data;
      },
      () => mockApi.getReviewsByOwner(ownerId),
    );
  },
};

