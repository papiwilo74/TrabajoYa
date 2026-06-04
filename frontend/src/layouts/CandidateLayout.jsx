// frontend/src/layouts/CandidateLayout.jsx
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import styles from './Layout.module.css';

export const CandidateLayout = () => {
  const { pathname } = useLocation();
  const { theme, toggle } = useTheme();
  const { user, logout } = useAuth();

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoMark}>TY</span>
          <span className={styles.logoText}>TrabajoYa</span>
        </Link>

        <nav className={styles.nav}>
          <Link to="/candidato/buscar" className={`${styles.navLink} ${pathname.includes('buscar') ? styles.active : ''}`}>
            Buscar empleos
          </Link>
          <Link to="/candidato/mis-postulaciones" className={`${styles.navLink} ${pathname.includes('mis-postulaciones') ? styles.active : ''}`}>
            Mis postulaciones
          </Link>
          <Link to="/candidato/perfil" className={`${styles.navLink} ${pathname.includes('perfil') ? styles.active : ''}`}>
            Mi perfil
          </Link>
        </nav>

        <button className={styles.themeBtn} onClick={toggle} aria-label="Cambiar tema" title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}>
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        {user ? (
          <>
            <span className={styles.userInfo}>👋 {user.name}</span>
            <button className={styles.logoutBtn} onClick={logout}>
              Salir
            </button>
          </>
        ) : (
          <Link to="/login" className={styles.ctaBtn}>
            Iniciar sesión
          </Link>
        )}
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
};