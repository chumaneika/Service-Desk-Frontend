export const REQUEST_STATUSES = {
  CREATED: 'CREATED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
};

export const STATUS_LABELS = {
  [REQUEST_STATUSES.CREATED]: 'Новая',
  [REQUEST_STATUSES.IN_PROGRESS]: 'В работе',
  [REQUEST_STATUSES.COMPLETED]: 'Завершена',
  [REQUEST_STATUSES.FAILED]: 'Не выполнена',
};

export const STATUS_TONES = {
  [REQUEST_STATUSES.CREATED]: 'neutral',
  [REQUEST_STATUSES.IN_PROGRESS]: 'info',
  [REQUEST_STATUSES.COMPLETED]: 'success',
  [REQUEST_STATUSES.FAILED]: 'danger',
};

export const FEEDBACK_OPTIONS = {
  GOOD: 'GOOD',
  BAD: 'BAD',
};

export const FEEDBACK_LABELS = {
  GOOD: 'Хорошо',
  BAD: 'Плохо',
};

