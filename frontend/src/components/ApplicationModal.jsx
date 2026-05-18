/* frontend/src/components/ApplicationModal.jsx */
import { useState, useEffect, useRef } from 'react';
import styles from './ApplicationModal.module.css';

export const ApplicationModal = ({ job, onClose }) => {
  const [step, setStep] = useState(1); // 1 = form, 2 = success
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);
  const overlayRef = useRef(null);

  // Trap focus & close on Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const handleChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setStep(2);
  };

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  return (
    <div className={styles.overlay} ref={overlayRef} onClick={handleOverlayClick} role="dialog" aria-modal="true">
      <div className={styles.modal}>
        {/* Close button */}
        <button className={styles.closeBtn} onClick={onClose} aria-label="Cerrar">✕</button>

        {step === 1 ? (
          <>
            {/* Header */}
            <div className={styles.modalHeader}>
              <div className={styles.jobAvatar}>
                {job.title.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className={styles.modalLabel}>Postulación para</p>
                <h2 className={styles.modalTitle}>{job.title}</h2>
                <div className={styles.modalMeta}>
                  <span className={styles.metaTag}> {job.location}</span>
                  {job.salary && (
                    <span className={styles.metaTag}>
                       ${Number(job.salary).toLocaleString('es-CO')}
                    </span>
                  )}
                  <span className={`${styles.metaTag} ${job.type === 'formal' ? styles.formal : styles.informal}`}>
                    {job.type}
                  </span>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className={styles.divider} />

            {/* Form */}
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label}>Nombre completo *</label>
                  <input
                    className={styles.input}
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Ej. María García"
                    required
                    autoFocus
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Teléfono</label>
                  <input
                    className={styles.input}
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Ej. 300 123 4567"
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Correo electrónico *</label>
                <input
                  className={styles.input}
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="tu@correo.com"
                  required
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>
                  ¿Por qué eres el candidato ideal?
                  <span className={styles.optional}> (opcional)</span>
                </label>
                <textarea
                  className={`${styles.input} ${styles.textarea}`}
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Cuéntale al empleador sobre tu experiencia y motivación…"
                  rows={4}
                />
              </div>

              <div className={styles.formFooter}>
                <p className={styles.privacy}>
                   Tu información es privada y solo se comparte con el empleador.
                </p>
                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={loading}
                >
                  {loading ? (
                    <span className={styles.spinner} />
                  ) : (
                    'Enviar postulación →'
                  )}
                </button>
              </div>
            </form>
          </>
        ) : (
          /* Success state */
          <div className={styles.success}>
            <div className={styles.successIcon}></div>
            <h2 className={styles.successTitle}>¡Postulación enviada!</h2>
            <p className={styles.successText}>
              Tu aplicación para <strong>{job.title}</strong> fue recibida con éxito.
              El empleador se pondrá en contacto contigo pronto.
            </p>
            <div className={styles.successCard}>
              <span className={styles.successLabel}> Confirmación enviada a</span>
              <span className={styles.successEmail}>{formData.email}</span>
            </div>
            <button className={styles.doneBtn} onClick={onClose}>
              Ver más vacantes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};