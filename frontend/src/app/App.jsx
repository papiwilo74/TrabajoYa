// frontend/src/app/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '../context/ThemeContext';
import { CandidateLayout } from '../layouts/CandidateLayout';
import { EmployerLayout } from '../layouts/EmployerLayout';
import { JobSearchPage } from '../pages/JobSearchPage';
import { CreateJobPage } from '../pages/CreateJobPage';
import { CandidateProfilePage } from '../pages/CandidateProfilePage';
import { EmployerDashboardPage } from '../pages/EmployerDashboardPage';

export const App = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/candidato/buscar" />} />

          <Route path="/candidato" element={<CandidateLayout />}>
            <Route path="buscar" element={<JobSearchPage />} />
            <Route path="mis-postulaciones" element={<h3 style={{padding:'2rem'}}>Próximamente</h3>} />
            <Route path="perfil" element={<CandidateProfilePage />} />
          </Route>

          <Route path="/empresa" element={<EmployerLayout />}>
            <Route path="dashboard" element={<EmployerDashboardPage />} />
            <Route path="publicar" element={<CreateJobPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};