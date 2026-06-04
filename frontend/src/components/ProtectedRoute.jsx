import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ allowedRole, redirectPath = '/login' }) => {
  const { user, loading, role } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'grid', placeItems: 'center', minHeight: '100vh', fontFamily: 'sans-serif', color: 'var(--text-secondary)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '32px',
            height: '32px',
            border: '3px solid var(--border-color)',
            borderTopColor: 'var(--brand-primary)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite'
          }} />
          <p>Cargando sesión...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={redirectPath} replace />;
  }

  if (allowedRole && role !== allowedRole) {
    // Si un candidato intenta entrar a empresa o viceversa, redireccionamos a su vista correcta
    const target = role === 'employer' ? '/empresa/dashboard' : '/candidato/buscar';
    return <Navigate to={target} replace />;
  }

  return <Outlet />;
};
