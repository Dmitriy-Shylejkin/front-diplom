import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../layout/DashboardLayout';
import './ProgramsPage.css';
import { GraduationCap, Code, Hash, ChevronRight } from 'lucide-react';
import { usePrograms } from '../mocks/usePrograms';

const ProgramsPage = () => {
  const { facultyId } = useParams();
  const navigate = useNavigate();
  const programs = usePrograms('') // TODO: добаить facultyId в usePrograms
  console.log(programs);

  return (
    <DashboardLayout>
      <h1 className="section-title">ОБРАЗОВАТЕЛЬНЫЕ ПРОГРАММЫ</h1>
      
      <div className="programs-list">
        {programs?.map((program: any) => (
          <div
            key={program.id}
            className="program-card"
            onClick={() => navigate(`/programs/${program.id}/groups`)}
          >
            <div className="program-header">
              <GraduationCap size={24} className="program-icon" />
              <h2 className="program-name">{program.name}</h2>
              <ChevronRight size={20} className="program-arrow" />
            </div>
            
            <div className="program-details">
              <div className="detail-item">
                <Code size={16} />
                <span>{program.code}</span>
              </div>
              <div className="detail-item">
                <Hash size={16} />
                <span>{program.shortName}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default ProgramsPage;