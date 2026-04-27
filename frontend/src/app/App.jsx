import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CandidateLayout } from '../layouts/CandidateLayout';
import { EmployerLayout } from '../layouts/EmployerLayout';
import { JobSearchPage } from '../pages/JobSearchPage';
import { CreateJobPage } from '../pages/CreateJobPage';
export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Si alguien entra a la raíz "/", lo mandamos directo a buscar empleo */}
        <Route path="/" element={<Navigate to="/candidato/buscar" />} />

        {/* Rutas de Candidatos (Usan el molde azul) */}
        <Route path="/candidato" element={<CandidateLayout />}>
          <Route path="buscar" element={<JobSearchPage />} />
          <Route path="mis-postulaciones" element={<h3>Página de mis postulaciones (Próximamente)</h3>} />
        </Route>

        {/* Rutas de Empresas (Usan el molde verde) */}
        <Route path="/empresa" element={<EmployerLayout />}>
          <Route path="dashboard" element={<h3>Panel de control de la empresa (Próximamente)</h3>} />
          <Route path="publicar" element={<CreateJobPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};