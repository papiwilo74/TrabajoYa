// frontend/src/layouts/EmployerLayout.jsx
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import styles from './Layout.module.css';

export const EmployerLayout = () => {
  const { pathname } = useLocation();
  const { theme, toggle } = useTheme();
  const { user, logout } = useAuth();

  return (
    <div className={styles.shell}>
      <header className={`${styles.header} ${styles.headerEmployer}`}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoMark}>TY</span>
          <span className={styles.logoText}>TrabajoYa</span>
        </Link>

        <nav className={styles.nav}>
          <Link to="/empresa/dashboard" className={`${styles.navLink} ${pathname.includes('dashboard') ? styles.active : ''}`}>
            Mi panel
          </Link>
          <Link to="/empresa/publicar" className={`${styles.navLink} ${pathname.includes('publicar') ? styles.active : ''}`}>
            Publicar vacante
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