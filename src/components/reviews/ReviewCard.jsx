import { getFullName } from '../../utils/formatters';

const ReviewCard = ({ review }) => (
  <article className="review-card">
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

