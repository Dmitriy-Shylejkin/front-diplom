import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './DashboardLayout.css';

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="layout-container">
      <header className="layout-header">
        <button onClick={() => navigate('/dashboard')} className='logo-button'>
          <img src="/logo_curator.png" alt="Logo" className="logo" />
        </button>
        <button onClick={handleLogout} className="logout-button">
          Выйти
        </button>
      </header>
      <main className="layout-main">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
