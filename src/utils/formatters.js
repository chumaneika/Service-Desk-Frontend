export const formatDate = (value) => {
  if (!value) {
    return 'Не указано';
  }

  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
};

export const getFullName = (user) => {
  if (!user) {
    return 'Не назначен';
  }

  return [user.name, user.surname].filter(Boolean).join(' ') || user.numberPhone || `ID ${user.id}`;
};

export const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? value : parsed;
};

