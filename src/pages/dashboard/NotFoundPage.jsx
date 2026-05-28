import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <main className="standalone-page">
      <EmptyState title="Страница не найдена" description="Похоже, маршрут изменился или был введен вручную." />
      <div className="centered-actions">
        <Button onClick={() => navigate('/')}>На главную</Button>
      </div>
    </main>
  );
};

export default NotFoundPage;

