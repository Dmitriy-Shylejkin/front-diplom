import React from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { logout } = useAuth();

  return (
    <div style={{ padding: 32 }}>
      <h1>Добро пожаловать!</h1>
      <p>Вы успешно авторизованы.</p>
      <button onClick={logout}>Выйти</button>
    </div>
  );
};

export default Dashboard;
