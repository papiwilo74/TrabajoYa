import { Outlet, Link } from 'react-router-dom';

export const EmployerLayout = () => {
  return (
    <div>
      <nav style={{ padding: '1rem', backgroundColor: '#e8f5e9' }}>
        <h2>TrabajoYa - Portal de Empresas</h2>
        <ul style={{ display: 'flex', gap: '1rem', listStyle: 'none' }}>
          <li><Link to="/empresa/dashboard">Mi Panel</Link></li>
          <li><Link to="/empresa/publicar">Publicar Vacante</Link></li>
        </ul>
      </nav>
      
      <main style={{ padding: '2rem' }}>
        <Outlet /> 
      </main>
    </div>
  );
};