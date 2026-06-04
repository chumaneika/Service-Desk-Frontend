import axiosClient from './axiosClient';
import { mockApi } from './mockData';
import { withMockFallback } from './mockFallback';
import { tokenStorage } from '../utils/tokenStorage';

const getCurrentUserId = () => tokenStorage.getUser()?.id;

export const reviewApi = {
  async createReview(payload, reviewOwner) {
    return withMockFallback(
      async () => {
        const response = await axiosClient.post(`/api/reviews/${reviewOwner}`, payload);
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

  async findReviewById(reviewId) {
    return withMockFallback(
      async () => {
        const response = await axiosClient.get(`/api/reviews/${reviewId}`, {
          params: { reviewId },
        });
        return response.data;
      },
      () => mockApi.findReviewById(reviewId),
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
