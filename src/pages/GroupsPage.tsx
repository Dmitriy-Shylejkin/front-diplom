import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../layout/DashboardLayout';
import './GroupsPage.css';
import { Users, User, Calendar, ChevronRight } from 'lucide-react';
import { useGroups } from '../mocks/useGroups';

const GroupsPage = () => {
  const { programId, curatorId } = useParams();
  const navigate = useNavigate();
  const groups = useGroups();  // TODO: добавить programId и curatorId в useGroups

  return (
    <DashboardLayout>
      <h1 className="section-title">УЧЕБНЫЕ ГРУППЫ</h1>
      
      <div className="groups-list">
        {groups?.map((group: any) => (
          <div
            key={group.id}
            className="group-card"
            onClick={() => navigate(`/students/${group.id}`)}
          >
            <div className="group-header">
              <Users size={24} className="group-icon" />
              <h2 className="group-name">{group.name}</h2>
              <ChevronRight size={20} className="group-arrow" />
            </div>
            
            <div className="group-details">
              <div className="detail-item">
                <User size={16} />
                <span>Куратор: {group.curatorId}</span>
              </div>
              <div className="detail-item">
                <Calendar size={16} />
                <span>Создана: {new Date(group.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default GroupsPage;