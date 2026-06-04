import { getFullName } from '../../utils/formatters';

const ReviewCard = ({ review, onClick }) => (
  <article
    className={`review-card ${onClick ? 'review-card--clickable' : ''}`}
    onClick={onClick}
    onKeyDown={(event) => {
      if (onClick && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault();
        onClick();
      }
    }}
    role={onClick ? 'button' : undefined}
    tabIndex={onClick ? 0 : undefined}
  >
    <div>
      <p className="eyebrow">Отзыв #{review.id}</p>
      <h3>{review.title}</h3>
    </div>
    <p>{review.description}</p>
    <div className="review-card__footer">
      <span>{getFullName(review.owner)}</span>
      {review.request && <span>Заявка #{review.request.id}</span>}
    </div>
  </article>
);

export default ReviewCard;
