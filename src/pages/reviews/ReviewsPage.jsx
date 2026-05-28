import { useEffect, useMemo, useState } from 'react';
import { reviewApi } from '../../api/reviewApi';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Loader from '../../components/common/Loader';
import SearchBar from '../../components/common/SearchBar';
import Textarea from '../../components/common/Textarea';
import ReviewCard from '../../components/reviews/ReviewCard';
import { useAuth } from '../../hooks/useAuth';
import { getErrorMessage } from '../../utils/errors';
import { isAdminRole, ROLES } from '../../utils/roles';

const ReviewsPage = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({
    title: '',
    description: '',
    requestId: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadReviews = async () => {
    setIsLoading(true);
    setError('');

    try {
      const data = isAdminRole(user.role) ? await reviewApi.getAllReviews() : await reviewApi.getReviewsByOwner(user.id);
      setReviews(data || []);
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'Не удалось загрузить отзывы.'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id, user.role]);

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!form.title.trim() || !form.description.trim() || !form.requestId) {
      setError('Заполните requestId, название и описание.');
      return;
    }

    setIsSubmitting(true);

    try {
      await reviewApi.createReview({
        ...form,
        requestId: Number(form.requestId),
      });
      setForm({ title: '', description: '', requestId: '' });
      setSuccess('Review создан.');
      await loadReviews();
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'Не удалось создать review.'));
    } finally {
      setIsSubmitting(false);
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

      {user.role === ROLES.USER && (
        <form className="card-form compact-form" onSubmit={handleSubmit}>
          <Input
            label="Request ID"
            name="requestId"
            type="number"
            value={form.requestId}
            onChange={(event) => setForm((current) => ({ ...current, requestId: event.target.value }))}
            placeholder="101"
          />
          <Input
            label="Заголовок"
            name="title"
            value={form.title}
            onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
            placeholder="Как прошло решение"
          />
          <Textarea
            label="Описание"
            name="description"
            value={form.description}
            onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
            rows={4}
          />
          <Button type="submit" isLoading={isSubmitting}>
            Создать review
          </Button>
        </form>
      )}

      <SearchBar value={search} onChange={setSearch} placeholder="Поиск по отзывам" />
      {error && <div className="alert alert--error">{error}</div>}
      {success && <div className="alert alert--success">{success}</div>}

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
                  description: 'Когда появятся reviews, они будут отображены здесь.',
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

