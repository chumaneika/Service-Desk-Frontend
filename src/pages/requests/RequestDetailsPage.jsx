import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { requestApi } from '../../api/requestApi';
import { reviewApi } from '../../api/reviewApi';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import Input from '../../components/common/Input';
import Loader from '../../components/common/Loader';
import Modal from '../../components/common/Modal';
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
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
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

  const openStatusModal = () => {
    setError('');
    setSuccess('');

    if (status === request.status) {
      setError('Выберите новый статус заявки.');
      return;
    }

    setIsStatusModalOpen(true);
  };

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
      setIsStatusModalOpen(false);
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'Не удалось изменить статус.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const openAssignModal = () => {
    setError('');
    setSuccess('');
    setIsAssignModalOpen(true);
  };

  const handleAssigneeKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openAssignModal();
    }
  };

  const handleAssignResponsible = async () => {
    if (!user?.id) {
      setError('Не удалось определить текущего пользователя.');
      setIsAssignModalOpen(false);
      return;
    }

    setIsAssigning(true);
    setError('');
    setSuccess('');

    try {
      const updatedRequest = await requestApi.assignResponsible(requestId, user.id);
      setRequest((currentRequest) => ({
        ...currentRequest,
        ...(updatedRequest || {}),
        assignedTo: updatedRequest?.assignedTo || updatedRequest?.responsible || user,
      }));
      setSuccess('Заявка назначена на вас.');
      setIsAssignModalOpen(false);
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'Не удалось назначить исполнителя.'));
    } finally {
      setIsAssigning(false);
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
      await reviewApi.createReview({
        ...reviewForm,
        owner: user.id,
        request: Number(requestId),
      }, feedback);
      setRequest((currentRequest) => ({
        ...currentRequest,
        reviewOwner: feedback,
      }));
      setReviewForm({ title: '', description: '' });
      setSuccess('Отзыв сохранен.');
    } catch (requestError) {
      if (requestError?.response?.data?.message === 'Review for this request already exists') {
        setError('Отзыв по этой заявке уже оставлен.');
        return;
      }

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
  const assignedUser = request.assignedTo || request.responsible;
  const canAssignResponsible = user.role === ROLES.ADMIN && !assignedUser;
  const selectedStatusLabel = STATUS_LABELS[status] || status;
  const currentStatusLabel = STATUS_LABELS[request.status] || request.status;

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
            <div
              className={canAssignResponsible ? 'meta-grid__item--action' : ''}
              role={canAssignResponsible ? 'button' : undefined}
              tabIndex={canAssignResponsible ? 0 : undefined}
              aria-label={canAssignResponsible ? 'Взять заявку в работу' : undefined}
              onClick={canAssignResponsible ? openAssignModal : undefined}
              onKeyDown={canAssignResponsible ? handleAssigneeKeyDown : undefined}
            >
              <dt>Исполнитель</dt>
              <dd>{getFullName(assignedUser)}</dd>
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
              <Button fullWidth onClick={openStatusModal}>
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

      <Modal
        isOpen={isAssignModalOpen}
        title="Взять заявку"
        onClose={() => setIsAssignModalOpen(false)}
        footer={(
          <>
            <Button variant="ghost" onClick={() => setIsAssignModalOpen(false)} disabled={isAssigning}>
              Отмена
            </Button>
            <Button onClick={handleAssignResponsible} isLoading={isAssigning}>
              Взять заявку
            </Button>
          </>
        )}
      >
        <p>Назначить вас исполнителем этой заявки?</p>
      </Modal>

      <Modal
        isOpen={isStatusModalOpen}
        title="Изменить статус"
        onClose={() => setIsStatusModalOpen(false)}
        footer={(
          <>
            <Button variant="ghost" onClick={() => setIsStatusModalOpen(false)} disabled={isSubmitting}>
              Отмена
            </Button>
            <Button onClick={handleStatusChange} isLoading={isSubmitting}>
              Изменить статус
            </Button>
          </>
        )}
      >
        <p>
          Изменить статус заявки с «{currentStatusLabel}» на «{selectedStatusLabel}»?
        </p>
      </Modal>
    </section>
  );
};

export default RequestDetailsPage;
