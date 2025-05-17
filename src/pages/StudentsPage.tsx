import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import DashboardLayout from '../layout/DashboardLayout';
import './StudentsPage.css';
import { Mail, Phone, Calendar, BookOpen, ChevronRight, Users, FileText, Plus, X } from 'lucide-react';
import { createStudent, useStudents } from '../mocks/useStudents';
import { context } from 'msw';

const StudentsPage = () => {
  const { groupId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [allStudents, setAllStudents] = useState([]);
  const [allSubjects, setAllSubjects] = useState([]);
  const [newStudent, setNewStudent] = useState({
    fullName: '',
    email: '',
    phone: '',
    groupId: groupId || ''
  });
  const [emailData, setEmailData] = useState({
    groupId: groupId || '',
    subject: '',
    type: 'test',
    time: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewStudent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEmailInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEmailData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const addStudent = async () => {
    try {
      const createdStudent = await createStudent(newStudent);
      const all = [...allStudents, createdStudent];
      setAllStudents(all as any);
      setIsModalOpen(false);
    } catch (err) {
      console.error('Ошибка при добавлении студента:', err);
    }
  };

  const deleteStudent = async (studentId: string) => {
    try {
      await fetch(`http://localhost:4000/students/${studentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}` || ''
        }
      });
      setAllStudents(allStudents.filter((student: any) => student.id !== studentId));
    } catch (err) {
      console.error('Ошибка при удалении студента:', err);
    }
  };

  const sendEmailGroup = async () => {
    try {
      const body = {
        groupId: Number(groupId),
        templateKey: emailData.type === "Напоминание о тесте" ? "TEST_REMINDER" : "EXAM_REMINDER",
        context: {
          subject: emailData.subject,
          datetime: emailData.time
        }
      }
      await fetch(`http://localhost:4000/email/send-group`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` || ''
        },
        body: JSON.stringify(body)
      });
      setIsEmailModalOpen(false);
      setEmailData({
        groupId: groupId || '',
        subject: '',
        type: 'test',
        time: ''
      });
    } catch (err) {
      console.error('Ошибка при отправке email:', err);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addStudent();
    setNewStudent({
      fullName: '',
      email: '',
      phone: '',
      groupId: groupId || ''
    });
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendEmailGroup();
  };

  useEffect(() => {
    let query = '';
    query = groupId ? query + `groupId=${groupId}` : query + '';
    fetch(`http://localhost:4000/students/?${query}`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` || ''
      },
    })
      .then((res) => res.json())
      .then(setAllStudents)
      .catch(console.error);

    fetch(`http://localhost:4000/subjects`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` || ''
      },
    })
      .then((res) => res.json())
      .then(setAllSubjects)
      .catch(console.error);
  }, [groupId]);

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
        <button
          onClick={() => setIsEmailModalOpen(true)} 
          className="email-button"
        >
          <Mail size={18} className="button-icon" />
          <span>Отправить email группе</span>
        </button>
        
        <button className="pdf-button">
          <FileText size={18} className="button-icon" />
          <span>Выгрузить отчет</span>
        </button>

        <button 
          className="add-button"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={18} className="button-icon" />
          <span>Добавить студента</span>
        </button>
      </div>

      {/* Модалка добавления студента */}
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
                <button type="submit">Добавить</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Модалка отправки email */}
      {isEmailModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Отправить email группе</h2>
            <form onSubmit={handleEmailSubmit}>
              <div className="form-group">
                <label>Группа ID:</label>
                <input
                  type="text"
                  name="groupId"
                  value={emailData.groupId}
                  readOnly
                  disabled
                />
              </div>
              
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
                <label>Предмет:</label>
                <select
                  name="subject"
                  value={emailData.subject}
                  onChange={handleEmailInputChange}
                  required
                >
                  <option value="">Выберите предмет</option>
                  {allSubjects.map((subject: any) => (
                    <option key={subject.id} value={subject.name}>{subject.name}</option>
                  ))}
                </select>
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

      <div className="students-grid">
        {allStudents?.map((student: any) => (
          <div key={student.id} className="student-card">
            <button 
              className="delete-button"
              onClick={() => deleteStudent(student.id)}
            >
              <X size={18} />
            </button>
            
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