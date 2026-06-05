import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import { requestApi } from '../../api/requestApi';
import { reviewApi } from '../../api/reviewApi';
import { userApi } from '../../api/userApi';
import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';
import SearchBar from '../../components/common/SearchBar';
import ReviewCard from '../../components/reviews/ReviewCard';
import { useAuth } from '../../hooks/useAuth';
import { getErrorMessage } from '../../utils/errors';
import { getFullName } from '../../utils/formatters';
import { isAdminRole } from '../../utils/roles';

const getReviewOwnerId = (review) => review?.ownerId || review?.owner?.id || review?.reviewOwner?.id;
const getReviewRequestId = (review) => review?.requestId || review?.request?.id || review?.requestEntity?.id;

const ReviewsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
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
      [review.title, review.description, review.owner?.name, String(getReviewRequestId(review) || '')].some((value) =>
        value?.toLowerCase().includes(query),
      ),
    );
  }, [reviews, search]);

  const hydrateReviewDetails = async (review) => {
    const ownerId = getReviewOwnerId(review);
    const requestId = getReviewRequestId(review);

    const [owner, request] = await Promise.all([
      ownerId && !review.owner && !review.reviewOwner
        ? userApi.findUserById(ownerId).catch(() => null)
        : Promise.resolve(null),
      requestId && !review.request && !review.requestEntity
        ? requestApi.getRequestById(requestId).catch(() => null)
        : Promise.resolve(null),
    ]);

    return {
      ...review,
      ...(owner ? { owner } : {}),
      ...(request ? { request } : {}),
    };
  };

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

      setSelectedReview(await hydrateReviewDetails({ ...review, ...data }));
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
  const reviewOwnerId = getReviewOwnerId(selectedReview) || reviewOwner?.id;
  const reviewRequestId = getReviewRequestId(selectedReview) || reviewRequest?.id;
  const openOwnerDetails = () => {
    if (reviewOwnerId) {
      navigate(`/super-admin/users/${reviewOwnerId}`);
    }
  };
  const openRequestDetails = () => {
    if (reviewRequestId) {
      navigate(`/requests/${reviewRequestId}`);
    }
  };
  const handleActionKeyDown = (event, action) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action();
    }
  };

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
              <div
                className={reviewOwnerId ? 'meta-grid__item--action' : ''}
                role={reviewOwnerId ? 'button' : undefined}
                tabIndex={reviewOwnerId ? 0 : undefined}
                aria-label={reviewOwnerId ? 'Открыть пользователя' : undefined}
                onClick={openOwnerDetails}
                onKeyDown={(event) => handleActionKeyDown(event, openOwnerDetails)}
              >
                <dt>Автор</dt>
                <dd>{isDetailsLoading && !reviewOwner ? 'Загружаем автора...' : getFullName(reviewOwner)}</dd>
              </div>
              <div
                className={reviewRequestId ? 'meta-grid__item--action' : ''}
                role={reviewRequestId ? 'button' : undefined}
                tabIndex={reviewRequestId ? 0 : undefined}
                aria-label={reviewRequestId ? 'Открыть заявку' : undefined}
                onClick={openRequestDetails}
                onKeyDown={(event) => handleActionKeyDown(event, openRequestDetails)}
              >
                <dt>Заявка</dt>
                <dd>{isDetailsLoading && !reviewRequestId ? 'Загружаем заявку...' : reviewRequestId ? `#${reviewRequestId}` : 'Не указана'}</dd>
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
