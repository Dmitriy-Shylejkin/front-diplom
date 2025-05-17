// StudentDetailsPage.tsx
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../layout/DashboardLayout';
import { Mail, Phone, Calendar, BookOpen, Users, FileText, Edit, List, Check, X } from 'lucide-react';
import './StudentDetailsPage.css';
import { useStudentDetail } from '../mocks/useStudentDetail';

const StudentDetailsPage = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  
  // const student: any = useStudentDetail(studentId || '') 
  const student = {
    "id": 8,
    "fullName": "Димас",
    "email": "modie8856@gmail.com",
    "phone": "+78005553535",
    "groupId": 3,
    "characteristic": "null",
    "createdAt": "2025-05-15T16:27:34.508Z",
    "updatedAt": "2025-05-15T16:27:34.508Z",
  }

  console.log('studentDetail: ', student)

  const [editData, setEditData] = useState({...student});

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // setEditData(prev => ({...prev, [name]: value}));
  };

  const saveChanges = () => {
    // Здесь должен быть вызов API для сохранения изменений
    // setStudent(editData); //TODO: добавить сохранение студентов
    setIsEditing(false);
  };

  const cancelEditing = () => {
    setEditData(student);
    setIsEditing(false);
  };

  const handleSendEmail = () => {
    // TODO: Логика отправки email добавть
  };

  const handleGenerateReport = () => {
    // TODO: Логика генерации отчета добавить
  };

  const handleViewGrades = () => {
    // TODO: Переход к просмотру оценок
  };

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
            {student.fullName.charAt(0).toUpperCase()}
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
                <div className="student-group">Группа: {student.groupId}</div>
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
                value={editData.characteristic}
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
              <button className="action-button" onClick={handleGenerateReport}>
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
    </DashboardLayout>
  );
};

export default StudentDetailsPage;