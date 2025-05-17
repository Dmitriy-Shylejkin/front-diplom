// CuratorsPage.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../layout/DashboardLayout';
import './CuratorsPage.css';
import { Mail, Users, Plus, MoreVertical, Trash2, Edit, UserPlus, X } from 'lucide-react';
import { BACKEND_URL } from '../constants';

interface Curator {
  id: number;
  email: string;
  fullName: string;
  phone: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface Group {
  id: number;
  name: string;
}

const CuratorsPage = () => {
  const [curators, setCurators] = useState<Curator[]>([]);
  const [allGroups, setAllGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddGroupModalOpen, setIsAddGroupModalOpen] = useState(false);
  const [currentCuratorId, setCurrentCuratorId] = useState<number | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [emailData, setEmailData] = useState({
    subject: '',
    type: 'test',
    time: ''
  });
  const [newCurator, setNewCurator] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: ''
  });
  const [menuOpen, setMenuOpen] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [curatorsRes, groupsRes] = await Promise.all([
          fetch(`${BACKEND_URL}/curators/all-curators`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }),
          fetch(`${BACKEND_URL}/groups`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          })
        ]);
        
        if (!curatorsRes.ok) throw new Error('Failed to fetch curators');
        if (!groupsRes.ok) throw new Error('Failed to fetch groups');
        
        const [curatorsData, groupsData] = await Promise.all([
          curatorsRes.json(),
          groupsRes.json()
        ]);
        
        setCurators(curatorsData);
        setAllGroups(groupsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEmailInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEmailData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCuratorInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCurator(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const sendMassEmail = async () => {
    try {
      const body = {
        templateKey: emailData.type === "test" ? "TEST_REMINDER" : "EXAM_REMINDER",
        context: {
          subject: emailData.subject,
          datetime: emailData.time
        }
      };
      
      await fetch(`${BACKEND_URL}/email/send-curators`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(body)
      });
      
      setIsEmailModalOpen(false);
      setEmailData({ subject: '', type: 'test', time: '' });
    } catch (err) {
      console.error('Error sending mass email:', err);
    }
  };

  const addCurator = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/curators`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newCurator)
      });
      
      if (!response.ok) throw new Error('Failed to add curator');
      
      const createdCurator = await response.json();
      setCurators([...curators, createdCurator]);
      setIsAddModalOpen(false);
      setNewCurator({
        fullName: '',
        email: '',
        phone: '',
        password: ''
      });
    } catch (err) {
      console.error('Error adding curator:', err);
    }
  };

  const deleteCurator = async (id: number) => {
    try {
      await fetch(`${BACKEND_URL}/curators/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setCurators(curators.filter(curator => curator.id !== id));
      setMenuOpen(null);
    } catch (err) {
      console.error('Error deleting curator:', err);
    }
  };

  const addGroupToCurator = async () => {
    if (!currentCuratorId || !selectedGroupId) return;

    console.log(selectedGroupId)

    const data = JSON.stringify({
      groupId: selectedGroupId
    })
    
    try {
      await fetch(`${BACKEND_URL}/curators/groups/${currentCuratorId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: data
      });
      
      setIsAddGroupModalOpen(false);
      setCurrentCuratorId(null);
      setSelectedGroupId(null);
    } catch (err) {
      console.error('Error adding group to curator:', err);
    }
  };

  const toggleMenu = (id: number) => {
    setMenuOpen(menuOpen === id ? null : id);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="loading-spinner"></div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="error-message">{error}</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="curators-header">
        <h1 className="section-title">
          <Users size={28} className="title-icon" />
          СПИСОК КУРАТОРОВ
        </h1>
      </div>

      <div className="action-buttons">
        <button
          onClick={() => setIsEmailModalOpen(true)} 
          className="email-button"
        >
          <Mail size={18} className="button-icon" />
          <span>Отправить массовый email</span>
        </button>
        
        <button 
          className="add-button"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus size={18} className="button-icon" />
          <span>Добавить куратора</span>
        </button>
      </div>

      <div className="curators-grid">
        {curators.map(curator => (
          <div key={curator.id} className="curator-card">
            <div className="curator-avatar">
              {curator.fullName.charAt(0).toUpperCase()}
            </div>
            
            <div className="curator-details">
              <h3 className="curator-name">{curator.fullName}</h3>
              
              <div className="curator-contacts">
                <div className="contact-item">
                  <Mail size={14} />
                  <span>{curator.email}</span>
                </div>
                <div className="contact-item">
                  <UserPlus size={14} />
                  <span>{curator.phone}</span>
                </div>
              </div>
              
              <div className="curator-meta">
                <div className="meta-item">
                  <span>Роль: {curator.role}</span>
                </div>
                <div className="meta-item">
                  <span>Добавлен: {new Date(curator.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            
            <div className="curator-actions">
              <button 
                className="menu-button"
                onClick={() => toggleMenu(curator.id)}
              >
                <MoreVertical size={20} />
              </button>
              
              {menuOpen === curator.id && (
                <div className="dropdown-menu">
                  <button 
                    className="dropdown-item"
                    onClick={() => {
                      navigate(`/curator/${curator.id}`);
                      setMenuOpen(null);
                    }}
                  >
                    <Edit size={14} />
                    <span>Подробнее</span>
                  </button>
                  <button 
                    className="dropdown-item"
                    onClick={() => {
                      setEmailData({
                        subject: '',
                        type: 'test',
                        time: ''
                      });
                      setIsEmailModalOpen(true);
                      setMenuOpen(null);
                    }}
                  >
                    <Mail size={14} />
                    <span>Отправить email</span>
                  </button>
                  <button 
                    className="dropdown-item"
                    onClick={() => {
                      setCurrentCuratorId(curator.id);
                      setIsAddGroupModalOpen(true);
                      setMenuOpen(null);
                    }}
                  >
                    <Users size={14} />
                    <span>Добавить группу</span>
                  </button>
                  <button 
                    className="dropdown-item danger"
                    onClick={() => deleteCurator(curator.id)}
                  >
                    <Trash2 size={14} />
                    <span>Удалить</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Mass Email Modal */}
      {isEmailModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Отправить email кураторам</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              sendMassEmail();
            }}>
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

      {/* Add Curator Modal */}
      {isAddModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Добавить нового куратора</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              addCurator();
            }}>
              <div className="form-group">
                <label>ФИО:</label>
                <input
                  type="text"
                  name="fullName"
                  value={newCurator.fullName}
                  onChange={handleCuratorInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={newCurator.email}
                  onChange={handleCuratorInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Телефон:</label>
                <input
                  type="tel"
                  name="phone"
                  value={newCurator.phone}
                  onChange={handleCuratorInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Пароль:</label>
                <input
                  type="password"
                  name="password"
                  value={newCurator.password}
                  onChange={handleCuratorInputChange}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setIsAddModalOpen(false)}>
                  Отмена
                </button>
                <button type="submit">Добавить</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Group to Curator Modal */}
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
              <button type="button" onClick={() => {
                setIsAddGroupModalOpen(false);
                setSelectedGroupId(null);
              }}>
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

export default CuratorsPage;