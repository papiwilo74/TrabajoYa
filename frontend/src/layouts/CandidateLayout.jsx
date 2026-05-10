// frontend/src/layouts/CandidateLayout.jsx
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import styles from './Layout.module.css';

export const CandidateLayout = () => {
  const { pathname } = useLocation();
  const { theme, toggle } = useTheme();

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

        <Link to="/empresa/publicar" className={styles.ctaBtn}>
          Publicar vacante
        </Link>
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
};