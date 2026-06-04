import { useNavigate } from 'react-router-dom';
import EmptyState from '../common/EmptyState';
import RoleBadge from '../common/RoleBadge';

const UserTable = ({ users = [], emptyTitle = 'Пользователи не найдены' }) => {
  const navigate = useNavigate();

  if (!users.length) {
    return <EmptyState title={emptyTitle} description="Попробуйте выбрать другую роль или изменить запрос." />;
  }

  const openUserDetails = (userId) => {
    navigate(`/super-admin/users/${userId}`);
  };

  return (
    <div className="table-shell">
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Имя</th>
            <th>Телефон</th>
            <th>Роль</th>
            <th>Статус</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              className="table__clickable-row"
              onClick={() => openUserDetails(user.id)}
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  openUserDetails(user.id);
                }
              }}
            >
              <td>#{user.id}</td>
              <td>
                <strong>{[user.name, user.surname].filter(Boolean).join(' ') || 'Без имени'}</strong>
              </td>
              <td>{user.numberPhone}</td>
              <td>
                <RoleBadge role={user.role} />
              </td>
              <td>{user.enabled ? 'Активен' : 'Отключен'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
