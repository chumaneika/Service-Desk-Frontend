import { MOCK_FALLBACK_ENABLED } from '../utils/constants';

export const isBackendUnavailable = (error) => {
  if (!MOCK_FALLBACK_ENABLED) {
    return false;
  }

  if (!error.response) {
    return true;
  }

  return [404, 500, 502, 503, 504].includes(error.response.status);
};

export const withMockFallback = async (request, fallback) => {
  try {
    return await request();
  } catch (error) {
    if (isBackendUnavailable(error)) {
      return fallback(error);
    }

    throw error;
  }
};

