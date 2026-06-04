// frontend/src/app/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '../context/ThemeContext';
import { AuthProvider } from '../context/AuthContext';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { CandidateLayout } from '../layouts/CandidateLayout';
import { EmployerLayout } from '../layouts/EmployerLayout';
import { JobSearchPage } from '../pages/JobSearchPage';
import { CreateJobPage } from '../pages/CreateJobPage';
import { CandidateProfilePage } from '../pages/CandidateProfilePage';
import { EmployerDashboardPage } from '../pages/EmployerDashboardPage';
import { CandidateApplicationsPage } from '../pages/CandidateApplicationsPage';

export const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Rutas Públicas */}
            <Route path="/" element={<Navigate to="/candidato/buscar" />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Layout de Candidato */}
            <Route path="/candidato" element={<CandidateLayout />}>
              <Route path="buscar" element={<JobSearchPage />} />
              
              {/* Rutas de Candidato Protegidas */}
              <Route element={<ProtectedRoute allowedRole="candidate" />}>
                <Route path="mis-postulaciones" element={<CandidateApplicationsPage />} />
                <Route path="perfil" element={<CandidateProfilePage />} />
              </Route>
            </Route>

            {/* Layout de Empresa Protegido */}
            <Route path="/empresa" element={<ProtectedRoute allowedRole="employer" />}>
              <Route element={<EmployerLayout />}>
                <Route path="dashboard" element={<EmployerDashboardPage />} />
                <Route path="publicar" element={<CreateJobPage />} />
              </Route>
            </Route>

            {/* Redirección por defecto */}
            <Route path="*" element={<Navigate to="/candidato/buscar" />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};