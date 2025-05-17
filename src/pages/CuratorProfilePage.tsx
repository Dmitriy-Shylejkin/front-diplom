// CuratorProfilePage.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import DashboardLayout from '../layout/DashboardLayout';
import { User, Mail, Phone, Lock, Save } from 'lucide-react';
import './CuratorProfilePage.css';

const CuratorProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setMessage({ text: 'Новые пароли не совпадают', type: 'error' });
      return;
    }

    try {
      const updatedData = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        ...(formData.newPassword && { 
          password: formData.newPassword,
          currentPassword: formData.currentPassword
        })
      };

      // Здесь будет реальный запрос к API
      const data = { success: true, user: { ...user, ...updatedData } };

      if (data.success) {
        updateUser(data.user);
        setEditMode(false);
        setMessage({ text: 'Данные успешно сохранены', type: 'success' });
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
      }
    } catch (error) {
      setMessage({ text: 'Ошибка при сохранении данных', type: 'error' });
      console.error('Update error:', error);
    }
  };

  if (!user) {
    return (
      <DashboardLayout>
        <div className="unauthorized-message">
          <h2>Необходима авторизация</h2>
          <p>Пожалуйста, войдите в систему.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="profile-page">
        <h1 className="section-title">ЛИЧНЫЙ КАБИНЕТ</h1>
        
        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="profile-card">
          <div className="profile-header">
            <h2>{user.fullName}</h2>
            <p className="role-badge">{user.role === 'curator' ? 'Куратор' : user.role}</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>
                <User size={18} /> ФИО
              </label>
              {editMode ? (
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                />
              ) : (
                <div className="field-value">{formData.fullName}</div>
              )}
            </div>

            <div className="form-group">
              <label>
                <Mail size={18} /> Email
              </label>
              {editMode ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              ) : (
                <div className="field-value">{formData.email}</div>
              )}
            </div>

            <div className="form-group">
              <label>
                <Phone size={18} /> Телефон
              </label>
              {editMode ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              ) : (
                <div className="field-value">{formData.phone || 'Не указан'}</div>
              )}
            </div>

            {editMode && (
              <>
                <div className="password-section">
                  <h3>Смена пароля</h3>
                  <div className="form-group">
                    <label>
                      <Lock size={18} /> Текущий пароль
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                      placeholder="Введите для смены пароля"
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      <Lock size={18} /> Новый пароль
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      placeholder="Оставьте пустым, если не меняете"
                    />
                  </div>

                  {formData.newPassword && (
                    <div className="form-group">
                      <label>
                        <Lock size={18} /> Подтвердите пароль
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                      />
                    </div>
                  )}
                </div>
              </>
            )}

            <div className="actions">
              {editMode ? (
                <>
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => {
                      setEditMode(false);
                      setFormData({
                        fullName: user.fullName || '',
                        email: user.email || '',
                        phone: user.phone || '',
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: ''
                      });
                    }}
                  >
                    Отмена
                  </button>
                  <button type="submit" className="save-btn">
                    <Save size={18} /> Сохранить
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="edit-btn"
                  onClick={() => setEditMode(true)}
                >
                  Редактировать профиль
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CuratorProfilePage;