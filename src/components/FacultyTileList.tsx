import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFaculties } from '../mocks/useFaculties';
import {
  GraduationCap,
  Building2,
  Landmark,
  Users,
  ShieldCheck,
  School
} from 'lucide-react';
import './FacultyTileList.css';

const icons = [
  <GraduationCap size={32} />, <Building2 size={32} />, <Landmark size={32} />,
  <Users size={32} />, <ShieldCheck size={32} />, <School size={32} />
];

const FacultyTileList = () => {
  const faculties = useFaculties();
  const navigate = useNavigate();

  return (
    <div className="tile-grid">
      {faculties.map((faculty, index) => (
        <div
          key={faculty.id}
          className="tile"
          onClick={() => navigate(`/groups/${faculty.id}`)}
        >
          <div className="tile-icon">{icons[index % icons.length]}</div>
          <div className="tile-title">{faculty.name}</div>
        </div>
      ))}
    </div>
  );
};

export default FacultyTileList;