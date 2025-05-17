import { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import DashboardLayout from '../layout/DashboardLayout';
import './StudentsPage.css';
import { Mail, Phone, Calendar, BookOpen, ChevronRight, Users, FileText, Plus } from 'lucide-react';
import { createStudent, useStudents } from '../mocks/useStudents';

const StudentsPage = () => {
  const { groupId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({
    fullName: '',
    email: '',
    phone: '',
    groupId: groupId || ''
  });
  
  const students = useStudents(); // TODO: добавить groupId в useStudents
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewStudent(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const addStudent = async () => {
    const createdStudent = await createStudent(newStudent); // Renamed to avoid conflict
    return createdStudent;
  }
  
  const handleSubmit = async (e: React.FormEvent) => { // Made async
    e.preventDefault();
    try {
      await addStudent(); // Call the add function
      console.log('Студент успешно добавлен:', newStudent);
      setIsModalOpen(false);
      // Сброс формы
      setNewStudent({
        fullName: '',
        email: '',
        phone: '',
        groupId: groupId || ''
      });
    } catch (error) {
      console.error('Ошибка при добавлении студента:', error);
    }
  };

  return (
    <DashboardLayout>
      <div className="students-header">
        <h1 className="section-title">
          <Users size={28} className="title-icon" />
          СПИСОК СТУДЕНТОВ
        </h1>
        <div className="group-info">Группа: {searchParams.get('groupName') || `ID: ${groupId}`}</div>
      </div>

      <div className="action-buttons">
        <button className="email-button">
          <Mail size={18} className="button-icon" />
          <span>Отправить email группе</span>
        </button>
        
        <button className="pdf-button">
          <FileText size={18} className="button-icon" />
          <span>Выгрузить отчет PDF</span>
        </button>

        <button 
          className="add-button"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={18} className="button-icon" />
          <span>Добавить студента</span>
        </button>
      </div>

      {/* Модальное окно для добавления студента */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Добавить нового студента</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>ФИО:</label>
                <input
                  type="text"
                  name="fullName"
                  value={newStudent.fullName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={newStudent.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Телефон:</label>
                <input
                  type="tel"
                  name="phone"
                  value={newStudent.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Группа ID:</label>
                <input
                  type="text"
                  name="groupId"
                  value={newStudent.groupId}
                  readOnly
                  disabled
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setIsModalOpen(false)}>
                  Отмена
                </button>
                <button type="submit" onClick={() => addStudent()}>Добавить</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="students-grid">
        {students?.map((student: any) => (
          <div key={student.id} className="student-card">
            <div className="student-avatar">
              {student.fullName.charAt(0).toUpperCase()}
            </div>
            
            <div className="student-details">
              <h3 className="student-name">{student.fullName}</h3>
              
              <div className="student-contacts">
                <div className="contact-item">
                  <Mail size={14} />
                  <span>{student.email}</span>
                </div>
                <div className="contact-item">
                  <Phone size={14} />
                  <span>{student.phone}</span>
                </div>
              </div>
              
              <div className="student-meta">
                <div className="meta-item">
                  <Calendar size={14} />
                  <span>Зачислен: {new Date(student.createdAt).toLocaleDateString()}</span>
                </div>
                {student.characteristic && (
                  <div className="meta-item">
                    <BookOpen size={14} />
                    <span>Характеристика: {student.characteristic}</span>
                  </div>
                )}
              </div>
            </div>
            
            <button 
              className="details-button"
              onClick={() => navigate(`/student/${student.id}`)}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default StudentsPage;