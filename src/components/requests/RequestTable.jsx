import { Link } from 'react-router-dom';
import { formatDate, getFullName } from '../../utils/formatters';
import EmptyState from '../common/EmptyState';
import StatusBadge from '../common/StatusBadge';

const RequestTable = ({ requests = [], showOwner = true, showAssignee = true, emptyTitle, emptyDescription }) => {
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
            <tr key={request.id}>
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
                <Link className="text-link" to={`/requests/${request.id}`}>
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

