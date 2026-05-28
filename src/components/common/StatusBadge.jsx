import { STATUS_LABELS, STATUS_TONES } from '../../utils/statuses';

const StatusBadge = ({ status }) => {
  const tone = STATUS_TONES[status] || 'neutral';

  return <span className={`badge badge--${tone}`}>{STATUS_LABELS[status] || status || 'Неизвестно'}</span>;
};

export default StatusBadge;

