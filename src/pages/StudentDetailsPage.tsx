// StudentDetailsPage.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../layout/DashboardLayout';
import { Mail, Phone, Calendar, BookOpen, Users, FileText, Edit, List, Check, X } from 'lucide-react';
import './StudentDetailsPage.css';
import { BACKEND_URL } from '../constants';

interface StudentData {
  fullName: string;
  groupId: string;
  email: string;
  phone: string;
  createdAt: string;
  characteristic?: string;
}

const StudentDetailsPage = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<StudentData>({
    fullName: '',
    groupId: '',
    email: '',
    phone: '',
    createdAt: '',
    characteristic: ''
  });

  const [student, setStudent] = useState({
    fullName: '',
    groupId: '',
    email: '',
    phone: '',
    createdAt: '',
    characteristic: ''
  });

  const [showReportDialog, setShowReportDialog] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  useEffect(() => {
    fetch(`${BACKEND_URL}/students/${studentId}`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` || ''
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setStudent(data)
        setEditData({...data})
      })
      .catch(console.error);
  }, [studentId]);


  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditData(prev => ({...prev, [name]: value}));
  };

  const saveChanges = async () => {
    const data = JSON.stringify(editData)
    console.log('ed', editData)
    await fetch(`${BACKEND_URL}/students/${studentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` || ''
      },
      body: data
    })
    .then((res) => res.json())
    .then((data) => {
      setStudent(data)
      setEditData({...data})
    })
    .catch(console.error);
    console.log('Сохранение данных:', editData);
    setIsEditing(false);
    // Здесь должен быть fetch/PUT запрос к API
  };

  const cancelEditing = () => {
    setEditData({...student});
    setIsEditing(false);
  };

  const handleSendEmail = () => {
    window.location.href = `mailto:${student.email}`;
  };

  const handleGenerateReport = async () => {
    setIsGeneratingReport(true);
    try {
      const response = await fetch(`${BACKEND_URL}/curators/report/${studentId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}` || ''
        }
      });
      
      if (!response.ok) throw new Error('Failed to generate report');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `student_${studentId}_report.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      
      setShowReportDialog(false);
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Ошибка при генерации отчета');
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const handleViewGrades = () => {
    navigate(`/student/grades/${studentId}`);
  };

  if (!studentId) {
    return (
      <DashboardLayout>
        <div className="error-message">ID студента не указан</div>
      </DashboardLayout>
    );
  }

  if (!student || Object.keys(student).length === 0) {
    return (
      <DashboardLayout>
        <div className="loading-message">Загрузка данных студента...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="student-header">
        <h1 className="section-title">
          <Users size={28} className="title-icon" />
          ПРОФИЛЬ СТУДЕНТА
        </h1>
        <div className="back-link" onClick={() => navigate(-1)}>
          Вернуться к списку студентов
        </div>
      </div>

      <div className="student-container">
        <div className="student-profile">
          <div className="student-avatar">
            {student.fullName?.charAt(0)?.toUpperCase() || '?'}
          </div>
          
          <div className="student-info">
            {!isEditing ? (
              <>
                <h2 className="student-name">{student.fullName}</h2>
                <div className="student-group">Группа: {student.groupId}</div>
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
                  name="groupId"
                  value={editData.groupId}
                  onChange={handleEditChange}
                  className="edit-input"
                />
              </>
            )}
          </div>
        </div>

        <div className="student-details">
          <div className="detail-section">
            <h3>Контактная информация</h3>
            <div className="detail-item">
              <Mail size={16} />
              {!isEditing ? (
                <span>{student.email}</span>
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
                <span>{student.phone}</span>
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
              <span>Зачислен: {new Date(student.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="detail-section">
            <h3>Характеристика</h3>
            {!isEditing ? (
              student.characteristic ? (
                <div className="detail-item">
                  <BookOpen size={16} />
                  <span>{student.characteristic}</span>
                </div>
              ) : (
                <div className="no-characteristic">Характеристика отсутствует</div>
              )
            ) : (
              <textarea
                name="characteristic"
                value={editData.characteristic || ''}
                onChange={handleEditChange}
                className="edit-textarea"
                rows={4}
              />
            )}
          </div>
        </div>

        <div className="student-actions">
          {!isEditing ? (
            <>
              <button className="action-button" onClick={() => setIsEditing(true)}>
                <Edit size={16} />
                Редактировать
              </button>
              <button className="action-button" onClick={handleViewGrades}>
                <List size={16} />
                Ведомость оценок
              </button>
              <button className="action-button" onClick={handleSendEmail}>
                <Mail size={16} />
                Отправить email
              </button>
              <button 
                className="action-button" 
                onClick={() => setShowReportDialog(true)}
              >
                <FileText size={16} />
                Создать отчет
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

      {/* Диалоговое окно создания отчета */}
      {showReportDialog && (
        <div className="report-dialog-overlay">
          <div className="report-dialog">
            <button 
              className="close-dialog"
              onClick={() => setShowReportDialog(false)}
            >
              <X size={20} />
            </button>
            
            <h3>Создание отчета</h3>
            <p>Будет создан отчет по всем оценкам студента:</p>
            <div className="student-info-report">
              <div><strong>ФИО:</strong> {student.fullName}</div>
              <div><strong>Группа:</strong> {student.groupId}</div>
            </div>
            
            <div className="dialog-buttons">
              <button 
                className="cancel-button"
                onClick={() => setShowReportDialog(false)}
              >
                Отмена
              </button>
              <button 
                className="generate-button"
                onClick={handleGenerateReport}
                disabled={isGeneratingReport}
              >
                {isGeneratingReport ? 'Создание...' : 'Создать отчет'}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default StudentDetailsPage;