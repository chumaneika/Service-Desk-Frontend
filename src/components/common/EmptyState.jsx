import Button from './Button';

const EmptyState = ({ title = 'Пока пусто', description, actionLabel, onAction }) => (
  <div className="empty-state">
    <div className="empty-state__mark" aria-hidden="true" />
    <h3>{title}</h3>
    {description && <p>{description}</p>}
    {actionLabel && onAction && (
      <Button variant="secondary" onClick={onAction}>
        {actionLabel}
      </Button>
    )}
  </div>
);

export default EmptyState;

