import { useEffect, useMemo, useState } from 'react';
import { reviewApi } from '../../api/reviewApi';
import Loader from '../../components/common/Loader';
import SearchBar from '../../components/common/SearchBar';
import ReviewCard from '../../components/reviews/ReviewCard';
import { useAuth } from '../../hooks/useAuth';
import { getErrorMessage } from '../../utils/errors';
import { isAdminRole } from '../../utils/roles';

const ReviewsPage = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadReviews = async () => {
      setIsLoading(true);
      setError('');

      try {
        const data = isAdminRole(user.role) ? await reviewApi.getAllReviews() : await reviewApi.getReviewsByOwner(user.id);
        setReviews(data || []);
      } catch (reviewsError) {
        setError(getErrorMessage(reviewsError, 'Не удалось загрузить отзывы.'));
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) {
      loadReviews();
    }
  }, [user?.id, user.role]);

  const filteredReviews = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) {
      return reviews;
    }

    return reviews.filter((review) =>
      [review.title, review.description, review.owner?.name, String(review.request?.id)].some((value) =>
        value?.toLowerCase().includes(query),
      ),
    );
  }, [reviews, search]);

  return (
    <section className="page-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Reviews</p>
          <h2>{isAdminRole(user.role) ? 'Все отзывы' : 'Мои отзывы'}</h2>
        </div>
      </div>

      <SearchBar value={search} onChange={setSearch} placeholder="Поиск по отзывам" />
      {error && <div className="alert alert--error">{error}</div>}

      {isLoading ? (
        <Loader label="Загружаем отзывы" />
      ) : (
        <div className="cards-grid">
          {filteredReviews.length ? (
            filteredReviews.map((review) => <ReviewCard key={review.id} review={review} />)
          ) : (
            <div className="grid-span">
              <ReviewCard
                review={{
                  id: 'empty',
                  title: 'Отзывов пока нет',
                  description: 'Когда вы оставите отзыв к заявке, он появится здесь.',
                }}
              />
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default ReviewsPage;
