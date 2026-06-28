/* frontend/src/pages/CreateJobPage.jsx */
import { useState } from 'react';
import styles from './CreateJobPage.module.css';

import { createJob } from '../services/api';

const CATEGORIES = ['general', 'tecnología', 'ventas', 'construcción', 'salud', 'educación', 'logística', 'gastronomía'];

export const CreateJobPage = () => {
  const [formData, setFormData] = useState({
    title: '', description: '', type: 'formal',
    category: 'general', location: 'Barranquilla', salary: ''
  });
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      await createJob(formData);
      setStatus('success');
      setFormData({ title: '', description: '', type: 'formal', category: 'general', location: 'Barranquilla', salary: '' });
    } catch (err) {
      setErrorMsg(err.message ?? 'No se pudo conectar con el servidor.');
      setStatus('error');
    }
  };

  return (
    <div className={styles.page}>
      <aside className={styles.sidebar}>
        <div className={styles.sideInner}>
          <span className={styles.sideLabel}>Para empresas</span>
          <h2 className={styles.sideTitle}>Publica tu vacante y encuentra el talento que necesitas</h2>
          <p className={styles.sideSub}>
            Miles de candidatos activos en Barranquilla buscan oportunidades como la tuya.
          </p>
          <ul className={styles.sideList}>
            <li> Publica en minutos</li>
            <li> Llega a candidatos verificados</li>
            <li> Empleos formales e informales</li>
          </ul>
        </div>
      </aside>

      <div className={styles.formWrap}>
        <h1 className={styles.formTitle}>Nueva vacante</h1>
        <p className={styles.formSub}>Completa los datos para publicar tu oferta de empleo.</p>

        {status === 'success' && (
          <div className={styles.alert + ' ' + styles.alertSuccess}>
             ¡Vacante publicada con éxito! Ya está visible para candidatos.
          </div>
        )}
        {status === 'error' && (
          <div className={styles.alert + ' ' + styles.alertError}>
             {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Título del cargo *</label>
              <input className={styles.input} type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Ej. Desarrollador Frontend" required />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Ubicación *</label>
              <input className={styles.input} type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Ej. Barranquilla, Norte" required />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Tipo de contrato</label>
              <select className={styles.input} name="type" value={formData.type} onChange={handleChange}>
                <option value="formal">Formal</option>
                <option value="informal">Informal / Por días</option>
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Categoría</label>
              <select className={styles.input} name="category" value={formData.category} onChange={handleChange}>
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Salario mensual (opcional)</label>
            <div className={styles.salaryWrap}>
              <span className={styles.salaryPrefix}>$</span>
              <input className={`${styles.input} ${styles.salaryInput}`} type="number" name="salary" value={formData.salary} onChange={handleChange} placeholder="Dejar vacío = A convenir" min="0" />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Descripción del cargo *</label>
            <textarea className={`${styles.input} ${styles.textarea}`} name="description" value={formData.description} onChange={handleChange} placeholder="Describe las responsabilidades, requisitos y beneficios…" rows={5} required />
          </div>

          <button type="submit" className={styles.submitBtn} disabled={status === 'loading'}>
            {status === 'loading' ? 'Publicando…' : 'Publicar vacante →'}
          </button>
        </form>
      </div>
    </div>
  );
};