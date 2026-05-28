import { useEffect, useMemo, useState } from 'react';
import { userApi } from '../../api/userApi';
import Loader from '../../components/common/Loader';
import SearchBar from '../../components/common/SearchBar';
import Select from '../../components/common/Select';
import UserTable from '../../components/users/UserTable';
import { getErrorMessage } from '../../utils/errors';
import { ROLE_LABELS, ROLES } from '../../utils/roles';

const ALL_ROLES = 'ALL';

const roleOptions = [
  { value: ALL_ROLES, label: 'Все' },
  ...[ROLES.USER, ROLES.ADMIN].map((role) => ({
    value: role,
    label: ROLE_LABELS[role],
  })),
];

const UserManagementPage = () => {
  const [selectedRole, setSelectedRole] = useState(ALL_ROLES);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true);
      setError('');

      try {
        const data = selectedRole === ALL_ROLES ? await userApi.findAllUsers() : await userApi.findUsersByRole(selectedRole);
        setUsers(data || []);
      } catch (requestError) {
        setError(getErrorMessage(requestError, 'Не удалось загрузить пользователей.'));
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, [selectedRole]);

  const filteredUsers = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) {
      return users;
    }

    return users.filter((user) =>
      [user.name, user.surname, user.numberPhone, String(user.id)].some((value) => value?.toLowerCase().includes(query)),
    );
  }, [search, users]);

  return (
    <section className="page-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Users</p>
          <h2>Пользователи по ролям</h2>
        </div>
      </div>

      <div className="toolbar">
        <Select
          label="Роль"
          name="role"
          value={selectedRole}
          onChange={(event) => setSelectedRole(event.target.value)}
          options={roleOptions}
        />
        <SearchBar value={search} onChange={setSearch} placeholder="Имя, телефон или ID" />
      </div>

      {error && <div className="alert alert--error">{error}</div>}
      {isLoading ? <Loader label="Загружаем пользователей" /> : <UserTable users={filteredUsers} />}
    </section>
  );
};

export default UserManagementPage;
