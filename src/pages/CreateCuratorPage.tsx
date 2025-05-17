// CreateCuratorPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../layout/DashboardLayout';
import { UserPlus, Mail, Phone, Lock, ChevronLeft } from 'lucide-react';
import './CreateCuratorPage.css';

const CreateCuratorPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // TODO: Заменить на реальный API вызов
      const response = await fetch('/api/curators', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          role: 'curator'
        }),
      });

      if (!response.ok) {
        throw new Error('Ошибка при создании куратора');
      }

      navigate('/curators'); // Перенаправление после успешного создания
    } catch (err) {
      setError(err.message || 'Произошла ошибка');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="curator-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ChevronLeft size={20} />
        </button>
        <h1 className="section-title">
          <UserPlus size={28} className="title-icon" />
          СОЗДАНИЕ КУРАТОРА
        </h1>
      </div>

      <div className="curator-container">
        <form onSubmit={handleSubmit} className="curator-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="fullName">ФИО куратора</label>
            <div className="input-wrapper">
              <UserPlus size={18} className="input-icon" />
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                placeholder="Иванов Иван Иванович"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-wrapper">
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="curator@example.com"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Пароль</label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Не менее 8 символов"
                minLength={8}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="phone">Телефон</label>
            <div className="input-wrapper">
              <Phone size={18} className="input-icon" />
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="+79161234567"
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Создание...' : 'Создать куратора'}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default CreateCuratorPage;