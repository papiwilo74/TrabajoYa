/* frontend/src/components/JobDetailPanel.jsx */
import { useEffect, useRef } from 'react';
import styles from './JobDetailModal.module.css';

const timeAgo = (date) => {
  const diff = Date.now() - new Date(date).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Publicado hoy';
  if (days === 1) return 'Publicado ayer';
  return `Publicado hace ${days} días`;
};

export const JobDetailModal = ({ job, onClose, onApply }) => {
  const panelRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const handleOverlayClick = (e) => {
    if (!panelRef.current?.contains(e.target)) onClose();
  };

  // Derive some mock detail data from the job
  const requirements = [
    'Experiencia mínima de 1 año en el área',
    'Disponibilidad inmediata',
    'Habilidades de comunicación efectiva',
  ];

  const benefits = job.type === 'formal'
    ? ['Contrato a término indefinido', 'Prestaciones de ley', 'Horario flexible', 'Ambiente colaborativo']
    : ['Pago por día / semana', 'Horario flexible', 'Trabajo dinámico'];

  return (
    <div className={styles.overlay} onClick={handleOverlayClick} role="dialog" aria-modal="true">
      <aside className={styles.panel} ref={panelRef}>
        {/* Panel header */}
        <div className={styles.panelHeader}>
          <button className={styles.backBtn} onClick={onClose} aria-label="Cerrar detalle">
            ← Volver
          </button>
          <button className={styles.closeX} onClick={onClose} aria-label="Cerrar">✕</button>
        </div>

        {/* Job hero block */}
        <div className={styles.jobHero}>
          <div className={styles.heroAvatar}>
            {job.title.charAt(0).toUpperCase()}
          </div>
          <div className={styles.heroInfo}>
            <div className={styles.heroBadges}>
              <span className={`${styles.badge} ${job.type === 'formal' ? styles.formal : styles.informal}`}>
                {job.type}
              </span>
              {job.category && (
                <span className={styles.badgeCategory}>{job.category}</span>
              )}
            </div>
            <h1 className={styles.heroTitle}>{job.title}</h1>
            <p className={styles.heroTime}>{timeAgo(job.createdAt)}</p>
          </div>
        </div>

        {/* Quick stats */}
        <div className={styles.statsRow}>
          <div className={styles.stat}>
            <span className={styles.statIcon}>📍</span>
            <div>
              <p className={styles.statLabel}>Ubicación</p>
              <p className={styles.statValue}>{job.location}</p>
            </div>
          </div>
          <div className={styles.stat}>
            <span className={styles.statIcon}>💰</span>
            <div>
              <p className={styles.statLabel}>Salario</p>
              <p className={styles.statValue}>
                {job.salary ? `$${Number(job.salary).toLocaleString('es-CO')}` : 'A convenir'}
              </p>
            </div>
          </div>
          <div className={styles.stat}>
            <span className={styles.statIcon}>📋</span>
            <div>
              <p className={styles.statLabel}>Contrato</p>
              <p className={styles.statValue}>
                {job.type === 'formal' ? 'Formal' : 'Informal / Por días'}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className={styles.content}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Descripción del cargo</h2>
            <p className={styles.sectionText}>{job.description}</p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Requisitos</h2>
            <ul className={styles.list}>
              {requirements.map((r, i) => (
                <li key={i} className={styles.listItem}>
                  <span className={styles.bullet}>✓</span>
                  {r}
                </li>
              ))}
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Lo que ofrecemos</h2>
            <ul className={styles.list}>
              {benefits.map((b, i) => (
                <li key={i} className={styles.listItem}>
                  <span className={styles.bulletAccent}>★</span>
                  {b}
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Sticky CTA */}
        <div className={styles.cta}>
          <div>
            <p className={styles.ctaTitle}>{job.title}</p>
            <p className={styles.ctaSub}>
              {job.salary ? `$${Number(job.salary).toLocaleString('es-CO')} / mes` : 'Salario a convenir'}
            </p>
          </div>
          <button className={styles.applyBtn} onClick={() => onApply(job)}>
            Postularme →
          </button>
        </div>
      </aside>
    </div>
  );
};