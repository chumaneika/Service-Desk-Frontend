import { NavLink } from 'react-router-dom';
import { NAVIGATION_BY_ROLE } from '../../utils/constants';
import { APP_NAME } from '../../utils/constants';
import RoleBadge from '../common/RoleBadge';

const Sidebar = ({ user, isOpen, onClose }) => {
  const navigation = NAVIGATION_BY_ROLE[user?.role] || [];

  return (
    <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
      <div className="sidebar__brand">
        <div className="sidebar__logo">SD</div>
        <div>
          <strong>{APP_NAME}</strong>
          <span>workspace</span>
        </div>
      </div>

      <nav className="sidebar__nav" aria-label="Главная навигация">
        {navigation.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onClose}
            className={({ isActive }) => `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar__profile">
        <RoleBadge role={user?.role} />
        <span>{user?.numberPhone}</span>
      </div>
    </aside>
  );
};

export default Sidebar;

