/* frontend/src/layouts/EmployerLayout.jsx */
import { Outlet, Link, useLocation } from 'react-router-dom';
import styles from './Layout.module.css';

export const EmployerLayout = () => {
  const { pathname } = useLocation();

  return (
    <div className={styles.shell}>
      <header className={`${styles.header} ${styles.headerEmployer}`}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoMark}>TY</span>
          <span className={styles.logoText}>TrabajoYa</span>
        </Link>

        <nav className={styles.nav}>
          <Link
            to="/empresa/dashboard"
            className={`${styles.navLink} ${pathname.includes('dashboard') ? styles.active : ''}`}
          >
            Mi panel
          </Link>
          <Link
            to="/empresa/publicar"
            className={`${styles.navLink} ${pathname.includes('publicar') ? styles.active : ''}`}
          >
            Publicar vacante
          </Link>
        </nav>

        <Link to="/candidato/buscar" className={`${styles.ctaBtn} ${styles.ctaBtnOutline}`}>
          Ver empleos
        </Link>
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
};