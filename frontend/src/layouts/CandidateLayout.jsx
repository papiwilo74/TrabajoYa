/* frontend/src/layouts/CandidateLayout.jsx */
import { Outlet, Link, useLocation } from 'react-router-dom';
import styles from './Layout.module.css';

export const CandidateLayout = () => {
  const { pathname } = useLocation();

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoMark}>TY</span>
          <span className={styles.logoText}>TrabajoYa</span>
        </Link>

        <nav className={styles.nav}>
          <Link
            to="/candidato/buscar"
            className={`${styles.navLink} ${pathname.includes('buscar') ? styles.active : ''}`}
          >
            Buscar empleos
          </Link>
          <Link
            to="/candidato/mis-postulaciones"
            className={`${styles.navLink} ${pathname.includes('mis-postulaciones') ? styles.active : ''}`}
          >
            Mis postulaciones
          </Link>
        </nav>

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