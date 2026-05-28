import { Link } from 'react-router-dom';
import { formatDate, getFullName } from '../../utils/formatters';
import StatusBadge from '../common/StatusBadge';

const RequestCard = ({ request }) => (
  <article className="request-card">
    <div className="request-card__header">
      <StatusBadge status={request.status} />
      <span>#{request.id}</span>
    </div>
    <h3>{request.title}</h3>
    <p>{request.description}</p>
    <dl className="meta-grid">
      <div>
        <dt>Создана</dt>
        <dd>{formatDate(request.createdAt)}</dd>
      </div>
      <div>
        <dt>Исполнитель</dt>
        <dd>{getFullName(request.assignedTo)}</dd>
      </div>
    </dl>
    <Link className="text-link" to={`/requests/${request.id}`}>
      Открыть детали
    </Link>
  </article>
);

export default RequestCard;

