import { useEffect, useState, useRef } from 'react';
import styles from './CandidateListModal.module.css';
import { getJobApplications } from '../services/api';

export const CandidateListModal = ({ job, onClose }) => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  useEffect(() => {
    fetch(`${API_URL}/api/jobs/${job.id}/applications`)
      .then((res) => {
        if (!res.ok) throw new Error('Error al obtener candidatos.');
        return res.json();
      })
      .then((data) => {
        setCandidates(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [job.id]);

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={styles.overlay} ref={overlayRef} onClick={handleOverlayClick} role="dialog" aria-modal="true">
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Cerrar">✕</button>
        
        <div className={styles.header}>
          <div className={styles.icon}>👥</div>
          <div>
            <span className={styles.label}>Postulantes para</span>
            <h2 className={styles.title}>{job.title}</h2>
            <p className={styles.meta}>📍 {job.location} · {job.type} · {candidates.length} candidato{candidates.length !== 1 ? 's' : ''}</p>
          </div>
        </div>

        <div className={styles.divider} />

        <div className={styles.content}>
          {loading ? (
            <div className={styles.loadingWrap}>
              <span className={styles.spinner} />
              <p className={styles.loading}>Cargando candidatos...</p>
            </div>
          ) : error ? (
            <p className={styles.error}>{error}</p>
          ) : candidates.length === 0 ? (
            <div className={styles.empty}>
              <p>Nadie se ha postulado todavía a esta vacante.</p>
            </div>
          ) : (
            <div className={styles.list}>
              {candidates.map((cand) => (
                <div key={cand.id} className={styles.card}>
                  <div className={styles.cardHeader}>
                    <div className={styles.avatar}>
                      {cand.candidateName.charAt(0).toUpperCase()}
                    </div>
                    <div className={styles.candInfo}>
                      <h4 className={styles.candName}>{cand.candidateName}</h4>
                      <span className={styles.candDate}>{formatDate(cand.createdAt)}</span>
                    </div>
                  </div>
                  <div className={styles.cardBody}>
                    <p className={styles.contactItem}>
                      <strong>📧 Correo:</strong> <a href={`mailto:${cand.candidateEmail}`} className={styles.link}>{cand.candidateEmail}</a>
                    </p>
                    {cand.candidatePhone && (
                      <p className={styles.contactItem}>
                        <strong>📞 Teléfono:</strong> <a href={`tel:${cand.candidatePhone}`} className={styles.link}>{cand.candidatePhone}</a>
                      </p>
                    )}
                    {cand.message && (
                      <div className={styles.messageBox}>
                        <p className={styles.messageLabel}>Mensaje del candidato:</p>
                        <p className={styles.messageContent}>{cand.message}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
