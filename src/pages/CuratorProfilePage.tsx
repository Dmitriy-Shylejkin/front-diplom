import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../layout/DashboardLayout';
import './CuratorProfilePage.css';
import { Lock, Users, ChevronRight } from 'lucide-react';
import { BACKEND_URL } from '../constants';

interface Group {
  id: number;
  name: string;
  program?: {
    name: string;
  };
}

const CuratorProfilePage = () => {
  const { user, logout, fetchUserData } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetchUserData();
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BACKEND_URL}/groups?curatorId=${user?.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch groups');
      
      const data = await response.json();
      setGroups(data);
    } catch (error) {
      console.error('Error fetching groups:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Новый пароль и подтверждение не совпадают');
      return;
    }

    console.log(passwordData.newPassword, passwordData.currentPassword, '---------')

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BACKEND_URL}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          oldPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Ошибка смены пароля');
      }
      
      alert('Пароль успешно изменен');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error changing password:', error);
      alert(error);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <DashboardLayout>
      <div className="profile-container">
        <h1 className="profile-header">Личный кабинет куратора</h1>
        
        <div className="profile-section">
          <h2 className="section-title">Основная информация</h2>
          <div className="info-item">
            <span className="info-label">Email:</span>
            <span className="info-value">{user.email}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Роль:</span>
            <span className="info-value">{user.role}</span>
          </div>
        </div>

        <div className="profile-section">
          <h2 className="section-title">Смена пароля</h2>
          <div className="password-form">
            <div className="form-group">
              <label>Текущий пароль:</label>
              <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
              />
            </div>
            <div className="form-group">
              <label>Новый пароль:</label>
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
              />
            </div>
            <div className="form-group">
              <label>Подтвердите пароль:</label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
              />
            </div>
            <button 
              className="change-password-button"
              onClick={handleChangePassword}
            >
              <Lock size={16} />
              Изменить пароль
            </button>
          </div>
        </div>

        <div className="profile-section">
          <h2 className="section-title">Мои группы</h2>
          {isLoading ? (
            <div>Загрузка...</div>
          ) : groups.length === 0 ? (
            <div>Нет привязанных групп</div>
          ) : (
            <div className="groups-list">
              {groups.map(group => (
                <div key={group.id} className="group-item">
                  <div className="group-info">
                    <span className="group-name">{group.name}</span>
                    <span className="group-program">{group.program?.name}</span>
                  </div>
                  <button 
                    className="view-group-button"
                    onClick={() => window.location.href = `/students/${group.id}`}
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CuratorProfilePage;