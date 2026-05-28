import { Link, useNavigate } from 'react-router-dom';
import { formatDate, getFullName } from '../../utils/formatters';
import EmptyState from '../common/EmptyState';
import StatusBadge from '../common/StatusBadge';

const RequestTable = ({ requests = [], showOwner = true, showAssignee = true, emptyTitle, emptyDescription }) => {
  const navigate = useNavigate();

  if (!requests.length) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="table-shell">
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Заявка</th>
            <th>Статус</th>
            {showOwner && <th>Автор</th>}
            {showAssignee && <th>Исполнитель</th>}
            <th>Обновлена</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr
              key={request.id}
              className="table__clickable-row"
              onClick={() => navigate(`/requests/${request.id}`)}
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  navigate(`/requests/${request.id}`);
                }
              }}
            >
              <td>#{request.id}</td>
              <td>
                <strong>{request.title}</strong>
                <span>{request.description}</span>
              </td>
              <td>
                <StatusBadge status={request.status} />
              </td>
              {showOwner && <td>{getFullName(request.createdBy)}</td>}
              {showAssignee && <td>{getFullName(request.assignedTo)}</td>}
              <td>{formatDate(request.updatedAt || request.createdAt)}</td>
              <td>
                <Link className="text-link" to={`/requests/${request.id}`} onClick={(event) => event.stopPropagation()}>
                  Детали
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RequestTable;
