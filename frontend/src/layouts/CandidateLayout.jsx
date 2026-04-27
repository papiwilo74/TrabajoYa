import { Outlet, Link } from 'react-router-dom';

export const CandidateLayout = () => {
  return (
    <div>
      <nav style={{ padding: '1rem', backgroundColor: '#e3f2fd' }}>
        <h2>TrabajoYa - Portal de Candidatos</h2>
        <ul style={{ display: 'flex', gap: '1rem', listStyle: 'none' }}>
          <li><Link to="/candidato/buscar">Buscar Empleos</Link></li>
          <li><Link to="/candidato/mis-postulaciones">Mis Postulaciones</Link></li>
        </ul>
      </nav>
      
      {/* El Outlet es donde React inyectará las páginas específicas */}
      <main style={{ padding: '2rem' }}>
        <Outlet /> 
      </main>
    </div>
  );
};