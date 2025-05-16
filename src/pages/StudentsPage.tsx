import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import DashboardLayout from '../layout/DashboardLayout';
import './StudentsPage.css';
import { Mail, Phone, Calendar, BookOpen, ChevronRight, Users, FileText } from 'lucide-react';
import { useStudents } from '../mocks/useStudents';

const StudentsPage = () => {
  const { groupId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const students = useStudents(); // TODO: добавить groupId в useStudents

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
      </div>

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
              onClick={() => navigate(`/students/${student.id}`)}
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