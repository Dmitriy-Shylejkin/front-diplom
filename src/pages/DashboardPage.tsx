import React from 'react';
import FacultyTileList from '../components/FacultyTileList';
import DashboardLayout from '../layout/DashboardLayout';
import '../styles/theme.css';

const DashboardPage = () => {
  return (
    <DashboardLayout>
      <h1 className="section-title">ФАКУЛЬТЕТЫ</h1>
      <FacultyTileList />
    </DashboardLayout>
  );
};

export default DashboardPage;
