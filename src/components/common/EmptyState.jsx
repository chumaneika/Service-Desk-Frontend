import Button from './Button';

const EmptyState = ({ title = 'Пока пусто', description, actionLabel, actionTo, onAction }) => (
  <div className="empty-state">
    <div className="empty-state__mark" aria-hidden="true" />
    <h3>{title}</h3>
    {description && <p>{description}</p>}
    {actionLabel && (actionTo || onAction) && (
      <Button variant="secondary" to={actionTo} onClick={onAction}>
        {actionLabel}
      </Button>
    )}
  </div>
);

export default EmptyState;
