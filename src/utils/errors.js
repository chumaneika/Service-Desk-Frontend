export const getErrorMessage = (error, fallback = 'Что-то пошло не так. Попробуйте еще раз.') => {
  if (typeof error?.response?.data === 'string') {
    return error.response.data;
  }

  if (error?.response?.status === 403) {
    return 'Нет прав для выполнения действия. Войдите под SUPER_ADMIN.';
  }

  return error?.response?.data?.message || error?.message || fallback;
};
