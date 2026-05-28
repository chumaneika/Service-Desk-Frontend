import EmptyState from '../common/EmptyState';
import RoleBadge from '../common/RoleBadge';

const UserTable = ({ users = [], emptyTitle = 'Пользователи не найдены' }) => {
  if (!users.length) {
    return <EmptyState title={emptyTitle} description="Попробуйте выбрать другую роль или изменить запрос." />;
  }

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
            <tr key={user.id}>
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

