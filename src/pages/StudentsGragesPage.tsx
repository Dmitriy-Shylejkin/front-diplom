import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '../layout/DashboardLayout';
import './StudentsGragesPage.css';
import { BookOpen, ChevronRight, Edit, Save, X as CloseIcon } from 'lucide-react';
import { BACKEND_URL } from '../constants';

enum GradeEnum {
  отлично = 'отлично',
  хорошо = 'хорошо',
  удовлетворительно = 'удовлетворительно',
  зачет = 'зачет',
  незачет = 'незачет',
}

const GradesPage = () => {
  const { studentId } = useParams();
  const [student, setStudent] = useState<any>(null);
  const [grades, setGrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingGradeId, setEditingGradeId] = useState<number | null>(null);
  const [editedGrade, setEditedGrade] = useState('');

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/grades/student/${studentId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}` || ''
          },
        });
        
        if (!response.ok) throw new Error('Ошибка загрузки данных');
        
        const data = await response.json();
        const { Grades, ...user } = data;
        setStudent(user);
        setGrades(Grades);
        setLoading(false);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        setLoading(false);
      }
    };

    fetchStudent();
  }, [studentId]);

  const startEditing = (gradeId: number, currentGrade: string) => {
    setEditingGradeId(gradeId);
    setEditedGrade(currentGrade);
  };

  const cancelEditing = () => {
    setEditingGradeId(null);
    setEditedGrade('');
  };

  const saveGrade = async (gradeId: number) => {
    try {
      const response = await fetch(`${BACKEND_URL}/grades/${gradeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` || ''
        },
        body: JSON.stringify({ grade: editedGrade })
      });

      if (!response.ok) throw new Error('Ошибка сохранения оценки');

      const updatedGrade = await response.json();
      
      setGrades(grades.map(grade => 
        grade.id === gradeId ? { ...grade, grade: updatedGrade.grade } : grade
      ));
      
      setEditingGradeId(null);
    } catch (error) {
      console.error('Ошибка при сохранении оценки:', error);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="loading-spinner"></div>
      </DashboardLayout>
    );
  }

  if (!student) {
    return (
      <DashboardLayout>
        <div className="error-message">Студент не найден</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="grades-header">
        <h1 className="section-title">
          <BookOpen size={28} className="title-icon" />
          УСПЕВАЕМОСТЬ СТУДЕНТА
        </h1>
        <div className="student-info">
          {student.fullName} ({student.email})
        </div>
      </div>

      <div className="grades-container">
        <div className="grades-list">
          {grades.map((gradeItem: any) => (
            <div key={gradeItem.id} className="grade-card">
              <div className="grade-subject">
                <ChevronRight size={20} className="subject-icon" />
                <span>{gradeItem.subjectName}</span>
              </div>
              
              {editingGradeId === gradeItem.id ? (
                <div className="grade-edit-container">
                  <select
                    value={editedGrade}
                    onChange={(e) => setEditedGrade(e.target.value)}
                    className="grade-select"
                  >
                    {Object.values(GradeEnum).map((grade) => (
                      <option key={grade} value={grade}>
                        {grade}
                      </option>
                    ))}
                  </select>
                  <button 
                    onClick={() => saveGrade(gradeItem.id)}
                    className="save-button"
                  >
                    <Save size={16} />
                  </button>
                  <button 
                    onClick={cancelEditing}
                    className="cancel-button"
                  >
                    <CloseIcon size={16} />
                  </button>
                </div>
              ) : (
                <div className="grade-value-container">
                  <span className={`grade-badge grade-${gradeItem.grade.toLowerCase()}`}>
                    {gradeItem.grade}
                  </span>
                  <button 
                    onClick={() => startEditing(gradeItem.id, gradeItem.grade)}
                    className="edit-button"
                  >
                    <Edit size={16} />
                  </button>
                </div>
              )}
              
              <div className="grade-date">
                {new Date(gradeItem.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default GradesPage;