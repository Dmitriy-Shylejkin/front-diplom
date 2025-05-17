// CuratorsPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import DashboardLayout from '../layout/DashboardLayout';
import './CuratorsPage.css';
import { User, Mail, Plus, Search, Edit, Trash2 } from 'lucide-react';

interface Curator {
  id: number;
  name: string;
  email: string;
  phone: string;
}

interface GroupFormData {
  name: string;
  programId: number;
  curatorId: number;
}

const CuratorsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [curators, setCurators] = useState<Curator[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCurator, setSelectedCurator] = useState<Curator | null>(null);
  const [showGroupForm, setShowGroupForm] = useState(false);
  const [groupForm, setGroupForm] = useState<GroupFormData>({
    name: '',
    programId: 1,
    curatorId: 0
  });
  const [programs, setPrograms] = useState<any[]>([]);

  useEffect(() => {
    // Mock data fetch
    const mockCurators: Curator[] = [
      { id: 1, name: 'Иванов Иван Иванович', email: 'ivanov@example.com', phone: '+79991234567' },
      { id: 2, name: 'Петрова Анна Сергеевна', email: 'petrova@example.com', phone: '+79992345678' },
      { id: 3, name: 'Сидоров Алексей Владимирович', email: 'sidorov@example.com', phone: '+79993456789' },
      { id: 4, name: 'Кузнецова Елена Дмитриевна', email: 'kuznetsova@example.com', phone: '+79994567890' },
      { id: 5, name: 'Смирнов Денис Олегович', email: 'smirnov@example.com', phone: '+79995678901' },
    ];

    const mockPrograms = [
      { id: 1, name: 'Информационные системы и технологии' },
      { id: 2, name: 'Прикладная математика и компьютерные науки' },
      { id: 3, name: 'Электроэнергетика и электротехника' },
      { id: 4, name: 'Строительство уникальных зданий и сооружений' },
      { id: 5, name: 'Нефтегазовое дело' },
    ];

    setCurators(mockCurators);
    setPrograms(mockPrograms);
  }, []);

  const filteredCurators = curators.filter(curator =>
    curator.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically make an API call to create the group
    console.log('Creating group:', groupForm);
    // Reset form and close
    setGroupForm({ name: '', programId: 1, curatorId: 0 });
    setShowGroupForm(false);
    setSelectedCurator(null);
  };

  const handleSendEmail = (curatorId?: number) => {
    if (curatorId) {
      // Send email to specific curator
      console.log(`Sending email to curator ${curatorId}`);
    } else {
      // Send email to all curators
      console.log('Sending email to all curators');
    }
  };

  const handleDeleteCurator = (curatorId: number) => {
    // Confirm deletion
    if (window.confirm('Вы уверены, что хотите удалить этого куратора?')) {
      setCurators(curators.filter(c => c.id !== curatorId));
    }
  };

  if (user?.role !== 'admin') {
    return (
      <DashboardLayout>
        <div className="unauthorized-message">
          <h2>Доступ запрещен</h2>
          <p>У вас нет прав для просмотра этой страницы.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="curators-page">
        <h1 className="section-title">УПРАВЛЕНИЕ КУРАТОРАМИ</h1>
        
        <div className="search-bar">
          <div className="search-input-container">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Поиск по ФИО куратора..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            className="email-all-btn"
            onClick={() => handleSendEmail()}
          >
            <Mail size={18} /> Отправить письмо всем
          </button>
        </div>

        <div className="curators-list">
          {filteredCurators.map(curator => (
            <div key={curator.id} className="curator-card">
              <div className="curator-info">
                <User size={24} className="curator-icon" />
                <div>
                  <h3>{curator.name}</h3>
                  <p>{curator.email}</p>
                  <p>{curator.phone}</p>
                </div>
              </div>
              <div className="curator-actions">
                <button 
                  className="action-btn add-group-btn"
                  onClick={() => {
                    setSelectedCurator(curator);
                    setGroupForm(prev => ({ ...prev, curatorId: curator.id }));
                    setShowGroupForm(true);
                  }}
                >
                  <Plus size={16} /> Добавить группу
                </button>
                <button 
                  className="action-btn email-btn"
                  onClick={() => handleSendEmail(curator.id)}
                >
                  <Mail size={16} />
                </button>
                <button 
                  className="action-btn edit-btn"
                  onClick={() => navigate(`/curators/edit/${curator.id}`)}
                >
                  <Edit size={16} />
                </button>
                <button 
                  className="action-btn delete-btn"
                  onClick={() => handleDeleteCurator(curator.id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {showGroupForm && selectedCurator && (
          <div className="modal-overlay">
            <div className="group-form-modal">
              <h3>Добавить группу для {selectedCurator.name}</h3>
              <form onSubmit={handleCreateGroup}>
                <div className="form-group">
                  <label>Название группы:</label>
                  <input
                    type="text"
                    value={groupForm.name}
                    onChange={(e) => setGroupForm({ ...groupForm, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Программа:</label>
                  <select
                    value={groupForm.programId}
                    onChange={(e) => setGroupForm({ ...groupForm, programId: parseInt(e.target.value) })}
                    required
                  >
                    {programs.map(program => (
                      <option key={program.id} value={program.id}>{program.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-buttons">
                  <button type="button" onClick={() => setShowGroupForm(false)}>
                    Отмена
                  </button>
                  <button type="submit" className="submit-btn">
                    Создать группу
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CuratorsPage;