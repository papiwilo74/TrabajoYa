import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './CandidateApplicationsPage.module.css';

export const CandidateApplicationsPage = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    try {
      const savedApps = JSON.parse(localStorage.getItem('trabajoya-my-applications') || '[]');
      // Sort by appliedAt descending
      savedApps.sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime());
      setApplications(savedApps);
    } catch (e) {
      console.error('Error loading local applications:', e);
    }
  }, []);

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Mis Postulaciones</h1>
          <p className={styles.sub}>Historial de empleos a los que te has postulado en este dispositivo.</p>
        </div>
        <Link to="/candidato/buscar" className={styles.backBtn}>
          ← Buscar más empleos
        </Link>
      </header>

      {applications.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>📂</div>
          <p className={styles.emptyText}>Aún no te has postulado a ninguna vacante.</p>
          <Link to="/candidato/buscar" className={styles.emptyBtn}>
            Explorar vacantes disponibles
          </Link>
        </div>
      ) : (
        <div className={styles.list}>
          {applications.map((app, index) => (
            <div
              key={app.jobId + '-' + index}
              className={styles.card}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className={styles.cardTop}>
                <div className={styles.avatar}>
                  {app.title ? app.title.charAt(0).toUpperCase() : '?'}
                </div>
                <div className={styles.jobInfo}>
                  <h3 className={styles.jobTitle}>{app.title}</h3>
                  <p className={styles.jobMeta}>
                    <span>📍 {app.location}</span>
                    <span className={styles.separator}>•</span>
                    <span className={`${styles.typeBadge} ${app.type === 'formal' ? styles.formal : styles.informal}`}>
                      {app.type}
                    </span>
                  </p>
                </div>
                <div className={styles.statusWrap}>
                  <span className={styles.statusBadge}>Enviada exitosamente</span>
                </div>
              </div>

              <div className={styles.cardFooter}>
                <div className={styles.salaryInfo}>
                  <span className={styles.label}>Salario ofertado</span>
                  <span className={styles.salary}>
                    {app.salary ? `$${Number(app.salary).toLocaleString('es-CO')}` : 'A convenir'}
                  </span>
                </div>
                <div className={styles.dateInfo}>
                  <span className={styles.label}>Fecha de postulación</span>
                  <span className={styles.date}>{formatDate(app.appliedAt)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
