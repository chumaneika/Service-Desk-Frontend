import { useEffect, useMemo, useState } from 'react';
import Button from '../../components/common/Button';
import { reviewApi } from '../../api/reviewApi';
import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';
import SearchBar from '../../components/common/SearchBar';
import ReviewCard from '../../components/reviews/ReviewCard';
import { useAuth } from '../../hooks/useAuth';
import { getErrorMessage } from '../../utils/errors';
import { getFullName } from '../../utils/formatters';
import { isAdminRole } from '../../utils/roles';

const ReviewsPage = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [error, setError] = useState('');
  const [detailsError, setDetailsError] = useState('');

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

  const openReviewPanel = async (review) => {
    setSelectedReview(review);
    setDetailsError('');
    setIsDetailsLoading(true);

    try {
      const reviewId = review?.id;
      const data = await reviewApi.findReviewById(reviewId);
      if (!data) {
        setDetailsError('Отзыв не найден.');
        return;
      }

      setSelectedReview(data);
    } catch (reviewsError) {
      setDetailsError(getErrorMessage(reviewsError, 'Не удалось загрузить отзыв.'));
    } finally {
      setIsDetailsLoading(false);
    }
  };

  const closeReviewPanel = () => {
    setSelectedReview(null);
    setDetailsError('');
    setIsDetailsLoading(false);
  };

  const isReviewPanelOpen = isDetailsLoading || detailsError || selectedReview;
  const reviewOwner = selectedReview?.owner || selectedReview?.reviewOwner;
  const reviewRequest = selectedReview?.request || selectedReview?.requestEntity;

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
            filteredReviews.map((review) => (
              <ReviewCard key={review.id} review={review} onClick={() => openReviewPanel(review)} />
            ))
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

      <Modal
        isOpen={Boolean(isReviewPanelOpen)}
        title="Детали отзыва"
        onClose={closeReviewPanel}
        footer={(
          <Button variant="ghost" onClick={closeReviewPanel}>
            Закрыть
          </Button>
        )}
      >
        {isDetailsLoading && !selectedReview ? (
          <Loader label="Загружаем отзыв" />
        ) : selectedReview ? (
          <div className="stack">
            {detailsError && <div className="alert alert--error">{detailsError}</div>}
            <div>
              <p className="eyebrow">Отзыв #{selectedReview.id}</p>
              <h3>{selectedReview.title}</h3>
            </div>
            <p className="details-card__description">{selectedReview.description}</p>
            <dl className="meta-grid meta-grid--wide">
              <div>
                <dt>Автор</dt>
                <dd>{getFullName(reviewOwner)}</dd>
              </div>
              <div>
                <dt>Заявка</dt>
                <dd>{reviewRequest?.id ? `#${reviewRequest.id}` : 'Не указана'}</dd>
              </div>
            </dl>
          </div>
        ) : detailsError ? (
          <div className="alert alert--error">{detailsError}</div>
        ) : null}
      </Modal>
    </section>
  );
};

export default ReviewsPage;
