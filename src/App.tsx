import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import PrivateRoute from './router/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import ProgramsPage from './pages/ProgramsPage';

function App() {
  return (
    <AuthProvider children={
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/programs/:facultyId" element={<ProgramsPage />} />
        <Route path="/dashboard" element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        } />
      </Routes>
    </BrowserRouter>
    }/>
  );
}

export default App;
