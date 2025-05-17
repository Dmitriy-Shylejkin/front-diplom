// CuratorDetailsPage.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../layout/DashboardLayout';
import { Mail, Phone, Calendar, Users, Edit, Check, X, Trash2, UserPlus } from 'lucide-react';
import './CuratorDetailsPage.css';
import { BACKEND_URL } from '../constants';

interface CuratorData {
  fullName: string;
  email: string;
  phone: string;
  createdAt: string;
  role: string;
  groups?: Array<{
    id: number;
    name: string;
  }>;
}

const CuratorDetailsPage = () => {
  const { curatorId } = useParams();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [editData, setEditData] = useState<CuratorData>({
    fullName: '',
    email: '',
    phone: '',
    createdAt: '',
    role: ''
  });
  const [emailData, setEmailData] = useState({
    subject: '',
    type: 'test',
    time: ''
  });

  const [curator, setCurator] = useState<CuratorData>({
    fullName: '',
    email: '',
    phone: '',
    createdAt: '',
    role: ''
  });

  const [allGroups, setAllGroups] = useState<Array<{id: number, name: string}>>([]);
  const [isAddGroupModalOpen, setIsAddGroupModalOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);

  useEffect(() => {
    fetch(`${BACKEND_URL}/curators/all-curators/${curatorId}`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` || ''
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setCurator(data);
        setEditData({...data});
      })
      .catch(console.error);

    fetch(`${BACKEND_URL}/groups`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` || ''
      },
    })
      .then((res) => res.json())
      .then(setAllGroups)
      .catch(console.error);
  }, [curatorId]);

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditData(prev => ({...prev, [name]: value}));
  };

  const saveChanges = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/curators/${curatorId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` || ''
        },
        body: JSON.stringify(editData)
      });
      
      if (!response.ok) throw new Error('Failed to update curator');
      
      const updatedData = await response.json();
      setCurator(updatedData);
      setEditData({...updatedData});
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating curator:', err);
    }
  };

  const cancelEditing = () => {
    setEditData({...curator});
    setIsEditing(false);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendEmailToCurator();
  };

  const sendEmailToCurator = async () => {
    try {
      const body = {
        curatorId: Number(curatorId),
        templateKey: emailData.type === "test" ? "TEST_REMINDER" : "EXAM_REMINDER",
        context: {
          subject: emailData.subject,
          datetime: emailData.time
        }
      };
      
      await fetch(`${BACKEND_URL}/email/send-curator`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` || ''
        },
        body: JSON.stringify(body)
      });
      
      setIsEmailModalOpen(false);
      setEmailData({
        subject: '',
        type: 'test',
        time: ''
      });
    } catch (err) {
      console.error('Error sending email:', err);
    }
  };

  const handleEmailInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEmailData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addGroupToCurator = async () => {
    if (!selectedGroupId) return;

    const data = JSON.stringify({
      groupId: selectedGroupId
    })
    
    try {
      await fetch(`${BACKEND_URL}/curators/groups/${curatorId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: data
      });
      
      // Refresh curator data
      const response = await fetch(`${BACKEND_URL}/curators/${curatorId}`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` || ''
        },
      });
      
      if (response.ok) {
        const updatedCurator = await response.json();
        setCurator(updatedCurator);
      }
      
      setIsAddGroupModalOpen(false);
      setSelectedGroupId(null);
    } catch (err) {
      console.error('Error adding group to curator:', err);
    }
  };

  const removeGroupFromCurator = async (groupId: number) => {
    try {
      await fetch(`${BACKEND_URL}/curators/${curatorId}/groups/${groupId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}` || ''
        }
      });
      
      // Refresh curator data
      const response = await fetch(`${BACKEND_URL}/curators/${curatorId}`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` || ''
        },
      });
      
      if (response.ok) {
        const updatedCurator = await response.json();
        setCurator(updatedCurator);
      }
    } catch (err) {
      console.error('Error removing group from curator:', err);
    }
  };

  const deleteCurator = async () => {
    if (window.confirm('Вы уверены, что хотите удалить этого куратора?')) {
      try {
        await fetch(`${BACKEND_URL}/curators/${curatorId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}` || ''
          }
        });
        navigate('/curators');
      } catch (err) {
        console.error('Error deleting curator:', err);
      }
    }
  };

  if (!curatorId) {
    return (
      <DashboardLayout>
        <div className="error-message">ID куратора не указан</div>
      </DashboardLayout>
    );
  }

  if (!curator || Object.keys(curator).length === 0) {
    return (
      <DashboardLayout>
        <div className="loading-message">Загрузка данных куратора...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="curator-header">
        <h1 className="section-title">
          <Users size={28} className="title-icon" />
          ПРОФИЛЬ КУРАТОРА
        </h1>
        <div className="back-link" onClick={() => navigate(-1)}>
          Вернуться к списку кураторов
        </div>
      </div>

      <div className="curator-container">
        <div className="curator-profile">
          <div className="curator-avatar">
            {curator.fullName?.charAt(0)?.toUpperCase() || '?'}
          </div>
          
          <div className="curator-info">
            {!isEditing ? (
              <>
                <h2 className="curator-name">{curator.fullName}</h2>
                <div className="curator-role">Роль: {curator.role}</div>
              </>
            ) : (
              <>
                <input
                  type="text"
                  name="fullName"
                  value={editData.fullName}
                  onChange={handleEditChange}
                  className="edit-input"
                />
                <input
                  type="text"
                  name="role"
                  value={editData.role}
                  onChange={handleEditChange}
                  className="edit-input"
                  disabled
                />
              </>
            )}
          </div>
        </div>

        <div className="curator-details">
          <div className="detail-section">
            <h3>Контактная информация</h3>
            <div className="detail-item">
              <Mail size={16} />
              {!isEditing ? (
                <span>{curator.email}</span>
              ) : (
                <input
                  type="email"
                  name="email"
                  value={editData.email}
                  onChange={handleEditChange}
                  className="edit-input"
                />
              )}
            </div>
            <div className="detail-item">
              <Phone size={16} />
              {!isEditing ? (
                <span>{curator.phone}</span>
              ) : (
                <input
                  type="tel"
                  name="phone"
                  value={editData.phone}
                  onChange={handleEditChange}
                  className="edit-input"
                />
              )}
            </div>
            <div className="detail-item">
              <Calendar size={16} />
              <span>Добавлен: {new Date(curator.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="detail-section">
            <h3>Прикрепленные группы</h3>
            {curator.groups && curator.groups.length > 0 ? (
              <div className="groups-list">
                {curator.groups.map(group => (
                  <div key={group.id} className="group-item">
                    <span>{group.name}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-groups">Нет прикрепленных групп</div>
            )}
          </div>
        </div>

        <div className="curator-actions">
          {!isEditing ? (
            <>
              <button className="action-button" onClick={() => setIsEditing(true)}>
                <Edit size={16} />
                Редактировать
              </button>
              <button 
                className="action-button" 
                onClick={() => setIsAddGroupModalOpen(true)}
              >
                <UserPlus size={16} />
                Добавить группу
              </button>
              <button 
                className="action-button" 
                onClick={() => setIsEmailModalOpen(true)}
              >
                <Mail size={16} />
                Отправить email
              </button>
              <button 
                className="action-button danger" 
                onClick={deleteCurator}
              >
                <Trash2 size={16} />
                Удалить куратора
              </button>
            </>
          ) : (
            <>
              <button className="action-button save" onClick={saveChanges}>
                <Check size={16} />
                Сохранить
              </button>
              <button className="action-button cancel" onClick={cancelEditing}>
                <X size={16} />
                Отменить
              </button>
            </>
          )}
        </div>
      </div>

      {/* Модальное окно отправки email */}
      {isEmailModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Отправить email куратору</h2>
            <form onSubmit={handleEmailSubmit}>
              <div className="form-group">
                <label>Тип напоминания:</label>
                <select
                  name="type"
                  value={emailData.type}
                  onChange={handleEmailInputChange}
                  required
                >
                  <option value="test">Напоминание о тесте</option>
                  <option value="exam">Напоминание о экзамене</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Тема:</label>
                <input
                  type="text"
                  name="subject"
                  value={emailData.subject}
                  onChange={handleEmailInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Время:</label>
                <input
                  type="datetime-local"
                  name="time"
                  value={emailData.time}
                  onChange={handleEmailInputChange}
                  required
                />
              </div>
              
              <div className="modal-actions">
                <button type="button" onClick={() => setIsEmailModalOpen(false)}>
                  Отмена
                </button>
                <button type="submit">Отправить</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Модальное окно добавления группы */}
      {isAddGroupModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Добавить группу куратору</h2>
            <div className="form-group">
              <label>Выберите группу:</label>
              <select
                className="group-select"
                value={selectedGroupId || ''}
                onChange={(e) => setSelectedGroupId(Number(e.target.value))}
              >
                <option value="">Выберите группу</option>
                {allGroups.map(group => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="modal-actions">
              <button 
                type="button" 
                onClick={() => {
                  setIsAddGroupModalOpen(false);
                  setSelectedGroupId(null);
                }}
              >
                Отмена
              </button>
              <button 
                type="button" 
                onClick={addGroupToCurator}
                disabled={!selectedGroupId}
              >
                Добавить
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default CuratorDetailsPage;