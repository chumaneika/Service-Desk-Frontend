import { ROLES } from '../utils/roles';
import { REQUEST_STATUSES } from '../utils/statuses';

export const mockUsers = [];
export const mockRequests = [];
export const mockReviews = [];

let activeMockUserId = null;

const createMockToken = (payload) => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = btoa(JSON.stringify(payload));
  return `${header}.${body}.mock-signature`;
};

const decodeMockToken = (token) => {
  if (!token?.includes('.')) {
    return {};
  }

  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return {};
  }
};

const getNextId = (items) => Math.max(...items.map((item) => item.id), 0) + 1;

const wait = async () => {
  await new Promise((resolve) => setTimeout(resolve, 250));
};

const ensureMockUser = ({ id, numberPhone, preferredRole }) => {
  const existingUser =
    mockUsers.find((user) => id && user.id === Number(id)) ||
    mockUsers.find((user) => numberPhone && user.numberPhone === numberPhone);

  if (existingUser) {
    return existingUser;
  }

  const user = {
    id: id ? Number(id) : getNextId(mockUsers),
    name: '',
    surname: '',
    role: preferredRole || ROLES.USER,
    numberPhone: numberPhone || '',
    enabled: true,
  };

  mockUsers.push(user);
  return user;
};

const getActiveMockUser = () => mockUsers.find((user) => user.id === activeMockUserId) || mockUsers[0] || null;

export const mockApi = {
  async login({ numberPhone, preferredRole }) {
    await wait();
    const user = ensureMockUser({ numberPhone, preferredRole });
    activeMockUserId = user.id;

    const payload = {
      sub: String(user.id),
      userId: user.id,
      numberPhone: user.numberPhone,
      role: user.role,
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
    };

    return {
      accessToken: createMockToken(payload),
      refreshToken: createMockToken({ ...payload, type: 'refresh' }),
      userId: user.id,
      numberPhone: user.numberPhone,
      role: user.role,
      name: user.name,
      surname: user.surname,
    };
  },

  async refresh(refreshToken) {
    await wait();
    const payload = decodeMockToken(refreshToken);
    const user =
      getActiveMockUser() ||
      ensureMockUser({
        id: payload.userId || payload.sub,
        numberPhone: payload.numberPhone,
        preferredRole: payload.role,
      });
    activeMockUserId = user.id;

    return {
      accessToken: createMockToken({
        sub: String(user.id),
        userId: user.id,
        numberPhone: user.numberPhone,
        role: user.role,
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
      }),
      refreshToken,
    };
  },

  async createUser(payload) {
    await wait();
    const newUser = {
      id: getNextId(mockUsers),
      enabled: true,
      ...payload,
    };
    mockUsers.push(newUser);
    return newUser;
  },

  async updateFullName(payload) {
    await wait();
    const user = getActiveMockUser();

    if (!user) {
      return payload;
    }

    Object.assign(user, payload);
    return user;
  },

  async findUserById(userId) {
    await wait();
    return mockUsers.find((user) => user.id === Number(userId)) || null;
  },

  async findAllUsers() {
    await wait();
    return mockUsers;
  },

  async findUsersByRole(role) {
    await wait();
    return mockUsers.filter((user) => user.role === role);
  },

  async createRequest(payload, currentUserId) {
    await wait();
    const owner =
      mockUsers.find((user) => user.id === Number(currentUserId)) ||
      ensureMockUser({
        id: currentUserId,
        preferredRole: ROLES.USER,
      });
    const request = {
      id: getNextId(mockRequests),
      title: payload.title,
      description: payload.description,
      status: REQUEST_STATUSES.CREATED,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      reviewOwner: owner,
      createdBy: owner,
      assignedTo: null,
      feedback: null,
    };
    mockRequests.unshift(request);
    return request;
  },

  async getRequestsByUser(userId) {
    await wait();
    return mockRequests.filter((request) => request.createdBy?.id === Number(userId));
  },

  async getRequestsByResponsible(userId) {
    await wait();
    return mockRequests.filter((request) => request.assignedTo?.id === Number(userId));
  },

  async getCreatedRequests() {
    await wait();
    return mockRequests.filter((request) => request.status === REQUEST_STATUSES.CREATED);
  },

  async getAllRequests() {
    await wait();
    return mockRequests;
  },

  async getRequestById(requestId) {
    await wait();
    return mockRequests.find((request) => request.id === Number(requestId)) || null;
  },

  async changeStatus(requestId, status) {
    await wait();
    const request = mockRequests.find((item) => item.id === Number(requestId));

    if (!request) {
      return null;
    }

    request.status = status;
    request.assignedTo = request.assignedTo || mockUsers.find((user) => user.role === ROLES.ADMIN) || null;
    request.updatedAt = new Date().toISOString();
    return request;
  },

  async leaveFeedback(requestId, feedback) {
    await wait();
    const request = mockRequests.find((item) => item.id === Number(requestId));

    if (!request) {
      return null;
    }

    request.feedback = feedback;
    request.updatedAt = new Date().toISOString();
    return request;
  },

  async createReview(payload, currentUserId) {
    await wait();
    const owner =
      mockUsers.find((user) => user.id === Number(currentUserId)) ||
      ensureMockUser({
        id: currentUserId,
        preferredRole: ROLES.USER,
      });
    const request = mockRequests.find((item) => item.id === Number(payload.requestId));
    const review = {
      id: getNextId(mockReviews),
      title: payload.title,
      description: payload.description,
      owner,
      request,
    };
    mockReviews.unshift(review);
    return review;
  },

  async getAllReviews() {
    await wait();
    return mockReviews;
  },

  async getReviewsByOwner(ownerId) {
    await wait();
    return mockReviews.filter((review) => review.owner?.id === Number(ownerId));
  },
};
