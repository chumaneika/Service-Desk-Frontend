export const normalizePhoneForServer = (phone) => {
  const trimmedPhone = String(phone || '').trim();

  if (!trimmedPhone) {
    return '';
  }

  const compactPhone = trimmedPhone.replace(/[\s()-]/g, '');

  if (compactPhone.startsWith('8')) {
    return `+7${compactPhone.slice(1)}`;
  }

  return compactPhone;
};
