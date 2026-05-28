import { ROLE_LABELS } from '../../utils/roles';

const RoleBadge = ({ role }) => <span className="badge badge--role">{ROLE_LABELS[role] || role || 'Role'}</span>;

export default RoleBadge;

