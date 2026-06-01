export const REQUEST_STATUSES = {
  CREATED: 'CREATED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
};

export const STATUS_LABELS = {
  [REQUEST_STATUSES.CREATED]: 'Новый запрос',
  [REQUEST_STATUSES.IN_PROGRESS]: 'В процессе выполнения',
  [REQUEST_STATUSES.COMPLETED]: 'Выполнен',
  [REQUEST_STATUSES.FAILED]: 'Запрос не выполнен',
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
