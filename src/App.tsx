import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import PrivateRoute from './router/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import ProgramsPage from './pages/ProgramsPage';
import GroupsPage from './pages/GroupsPage';
import StudentsPage from './pages/StudentsPage';
import StudentDetailsPage from './pages/StudentDetailsPage';
import StudentsGragesPage from  './pages/StudentsGragesPage'
import CuratorsPage from './pages/CuratorsPage';
import CuratorProfilePage from './pages/CuratorProfilePage';
import CuratorDetailsPage from './pages/CuratorDetailsPage';

function App() {
  return (
    <AuthProvider children={
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/programs/:facultyId" element={<ProgramsPage />} />
        <Route path="/programs" element={<ProgramsPage />} />
        <Route path="/groups/:programId" element={<GroupsPage />} />
        <Route path="/groups" element={<GroupsPage />} />
        <Route path="/students/:groupId" element={<StudentsPage />} />
        <Route path="/student/:studentId" element={<StudentDetailsPage />} />
        <Route path="/student/grades/:studentId" element={<StudentsGragesPage />} />
        <Route path="/curators" element={<CuratorsPage />} />
        <Route path="/curator/:curatorId" element={<CuratorDetailsPage />} />
        <Route path="/dashboard" element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        } />
        <Route path="/profile" element={
            <PrivateRoute>
              <CuratorProfilePage />
            </PrivateRoute>
          } />
      </Routes>
    </BrowserRouter>
    }/>
  );
}

export default App;
