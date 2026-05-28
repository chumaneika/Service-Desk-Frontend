import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { requestApi } from '../../api/requestApi';
import { reviewApi } from '../../api/reviewApi';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import Input from '../../components/common/Input';
import Loader from '../../components/common/Loader';
import Select from '../../components/common/Select';
import StatusBadge from '../../components/common/StatusBadge';
import Textarea from '../../components/common/Textarea';
import { useAuth } from '../../hooks/useAuth';
import { getErrorMessage } from '../../utils/errors';
import { formatDate, getFullName } from '../../utils/formatters';
import { ROLES } from '../../utils/roles';
import { FEEDBACK_LABELS, FEEDBACK_OPTIONS, REQUEST_STATUSES, STATUS_LABELS } from '../../utils/statuses';

const statusOptions = Object.values(REQUEST_STATUSES).map((status) => ({
  value: status,
  label: STATUS_LABELS[status],
}));

const feedbackOptions = Object.values(FEEDBACK_OPTIONS).map((feedback) => ({
  value: feedback,
  label: FEEDBACK_LABELS[feedback],
}));

const RequestDetailsPage = () => {
  const { requestId } = useParams();
  const { user } = useAuth();
  const [request, setRequest] = useState(null);
  const [status, setStatus] = useState(REQUEST_STATUSES.CREATED);
  const [feedback, setFeedback] = useState(FEEDBACK_OPTIONS.GOOD);
  const [reviewForm, setReviewForm] = useState({ title: '', description: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const loadRequest = async () => {
      setIsLoading(true);
      setError('');

      try {
        const data = await requestApi.getRequestById(requestId);
        setRequest(data);
        setStatus(data?.status || REQUEST_STATUSES.CREATED);
      } catch (requestError) {
        setError(getErrorMessage(requestError, 'Не удалось загрузить заявку.'));
      } finally {
        setIsLoading(false);
      }
    };

    loadRequest();
  }, [requestId]);

  const handleStatusChange = async () => {
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const updatedRequest = await requestApi.changeStatus(requestId, status);
      setRequest((currentRequest) => ({
        ...currentRequest,
        ...(updatedRequest || {}),
        status,
      }));
      setSuccess('Статус заявки обновлен.');
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'Не удалось изменить статус.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReviewSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!reviewForm.title.trim() || !reviewForm.description.trim()) {
      setError('Заполните название и описание отзыва.');
      return;
    }

    setIsSubmitting(true);

    try {
      const updatedRequest = await requestApi.leaveFeedback(requestId, feedback);
      await reviewApi.createReview({
        ...reviewForm,
        requestId: Number(requestId),
      });
      setRequest((currentRequest) => ({
        ...currentRequest,
        ...(updatedRequest || {}),
        feedback,
      }));
      setReviewForm({ title: '', description: '' });
      setSuccess('Отзыв сохранен.');
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'Не удалось оставить отзыв.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <Loader label="Загружаем заявку" />;
  }

  if (!request) {
    return <EmptyState title="Заявка не найдена" description="Проверьте ID или попробуйте открыть список заявок." />;
  }

  const requestAuthor = request.createdBy || (user.role === ROLES.USER ? user : null);

  return (
    <section className="page-section">
      <div className="details-grid">
        <article className="details-card">
          <div className="details-card__top">
            <div>
              <p className="eyebrow">Заявка #{request.id}</p>
              <h2>{request.title}</h2>
            </div>
            <StatusBadge status={request.status} />
          </div>

          <p className="details-card__description">{request.description}</p>

          <dl className="meta-grid meta-grid--wide">
            <div>
              <dt>Создана</dt>
              <dd>{formatDate(request.createdAt)}</dd>
            </div>
            <div>
              <dt>Обновлена</dt>
              <dd>{formatDate(request.updatedAt)}</dd>
            </div>
            <div>
              <dt>Автор</dt>
              <dd>{getFullName(requestAuthor)}</dd>
            </div>
            <div>
              <dt>Исполнитель</dt>
              <dd>{getFullName(request.assignedTo)}</dd>
            </div>
          </dl>
        </article>

        <aside className="side-panel">
          {error && <div className="alert alert--error">{error}</div>}
          {success && <div className="alert alert--success">{success}</div>}

          {user.role === ROLES.ADMIN && (
            <div className="panel-card">
              <h3>Изменить статус</h3>
              <Select
                label="Статус"
                name="status"
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                options={statusOptions}
              />
              <Button fullWidth isLoading={isSubmitting} onClick={handleStatusChange}>
                Сохранить статус
              </Button>
            </div>
          )}

          {user.role === ROLES.USER && (
            <form className="panel-card" onSubmit={handleReviewSubmit}>
              <h3>Оставить отзыв</h3>
              <Select
                label="Оценка"
                name="feedback"
                value={feedback}
                onChange={(event) => setFeedback(event.target.value)}
                options={feedbackOptions}
              />
              <Input
                label="Заголовок"
                name="reviewTitle"
                value={reviewForm.title}
                onChange={(event) => setReviewForm((form) => ({ ...form, title: event.target.value }))}
                placeholder="Короткий итог"
              />
              <Textarea
                label="Описание"
                name="reviewDescription"
                value={reviewForm.description}
                onChange={(event) => setReviewForm((form) => ({ ...form, description: event.target.value }))}
                placeholder="Расскажите, как прошло решение"
                rows={4}
              />
              <Button type="submit" fullWidth isLoading={isSubmitting}>
                Отправить отзыв
              </Button>
            </form>
          )}
        </aside>
      </div>
    </section>
  );
};

export default RequestDetailsPage;
