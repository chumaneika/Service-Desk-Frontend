import { Link, useNavigate } from 'react-router-dom';
import { formatDate, getFullName } from '../../utils/formatters';
import StatusBadge from '../common/StatusBadge';

const RequestCard = ({ request }) => {
  const navigate = useNavigate();
  const detailsPath = `/requests/${request.id}`;

  const openDetails = () => navigate(detailsPath);

  return (
    <article
      className="request-card request-card--clickable"
      onClick={openDetails}
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openDetails();
        }
      }}
    >
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
      <Link className="text-link" to={detailsPath} onClick={(event) => event.stopPropagation()}>
        Открыть детали
      </Link>
    </article>
  );
};

export default RequestCard;
