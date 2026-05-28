import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestApi } from '../../api/requestApi';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Textarea from '../../components/common/Textarea';
import { getErrorMessage } from '../../utils/errors';

const CreateRequestPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const updateField = (field, value) => {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!form.title.trim() || !form.description.trim()) {
      setError('Заполните название и описание заявки.');
      return;
    }

    setIsSubmitting(true);

    try {
      const request = await requestApi.createRequest(form);
      navigate(`/requests/${request.id}`);
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'Не удалось создать заявку.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="page-section narrow-section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Новая заявка</p>
          <h2>Опишите проблему простыми словами</h2>
        </div>
      </div>

      {error && <div className="alert alert--error">{error}</div>}

      <form className="card-form" onSubmit={handleSubmit}>
        <Input
          label="Название"
          name="title"
          value={form.title}
          onChange={(event) => updateField('title', event.target.value)}
          placeholder="Например: не работает VPN"
          maxLength={120}
        />
        <Textarea
          label="Описание"
          name="description"
          value={form.description}
          onChange={(event) => updateField('description', event.target.value)}
          placeholder="Что произошло, когда началось, что уже пробовали?"
          rows={7}
        />
        <div className="form-actions">
          <Button variant="secondary" onClick={() => navigate('/requests')}>
            Отмена
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            Создать заявку
          </Button>
        </div>
      </form>
    </section>
  );
};

export default CreateRequestPage;

