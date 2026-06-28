// frontend/src/pages/CandidateProfilePage.jsx
import { useState, useEffect } from 'react';
import { getMyProfile, updateProfile } from '../services/api';
import styles from './CandidateProfilePage.module.css';

const SKILLS_SUGGESTIONS = ['JavaScript','React','Node.js','Python','SQL','Diseño UX','Excel','Inglés','Ventas','Atención al cliente','Construcción','Electricidad','Contabilidad','Marketing'];

export const CandidateProfilePage = () => {
  const [profile, setProfile] = useState({
    name: '', email: '', phone: '', city: 'Barranquilla',
    bio: '', skills: [], experience: '', education: '',
    linkedin: '', github: '', avatarBase64: ''
  });
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [skillInput, setSkillInput] = useState('');

  useEffect(() => {
    getMyProfile()
      .then(data => {
        setProfile(prev => ({ ...prev, ...data }));
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleChange = e => setProfile(p => ({ ...p, [e.target.name]: e.target.value }));

  const addSkill = (skill) => {
    const s = skill.trim();
    if (s && !profile.skills.includes(s) && profile.skills.length < 10) {
      setProfile(p => ({ ...p, skills: [...p.skills, s] }));
      setSkillInput('');
    }
  };

  const removeSkill = (skill) => setProfile(p => ({ ...p, skills: p.skills.filter(s => s !== skill) }));

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(profile);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
      alert('Error al guardar el perfil');
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setProfile(p => ({ ...p, avatarBase64: ev.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const completeness = [profile.name, profile.email, profile.phone, profile.bio, profile.skills.length > 0, profile.experience, profile.education]
    .filter(Boolean).length;
  const pct = Math.round((completeness / 7) * 100);

  return (
    <div className={styles.page}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.avatarWrap}>
          <label className={styles.avatarBig} style={{ cursor: 'pointer', overflow: 'hidden' }} title="Cambiar foto de perfil">
            {profile.avatarBase64 ? (
              <img src={profile.avatarBase64} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              profile.name ? profile.name.charAt(0).toUpperCase() : '?'
            )}
            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
          </label>
          <h2 className={styles.profileName}>{profile.name || 'Tu nombre'}</h2>
          <p className={styles.profileCity}> {profile.city}</p>
        </div>

        <div className={styles.completenessWrap}>
          <div className={styles.completenessLabel}>
            <span>Perfil completado</span>
            <strong>{pct}%</strong>
          </div>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${pct}%` }} />
          </div>
        </div>

        {profile.skills.length > 0 && (
          <div className={styles.sideSkills}>
            <p className={styles.sideLabel}>Habilidades</p>
            <div className={styles.skillTags}>
              {profile.skills.map(s => <span key={s} className={styles.skillTag}>{s}</span>)}
            </div>
          </div>
        )}
      </aside>

      {/* Formulario */}
      <form className={styles.form} onSubmit={handleSave}>
        <div className={styles.formHeader}>
          <h1 className={styles.formTitle}>Mi perfil</h1>
          {saved && <span className={styles.savedBadge}> Guardado</span>}
        </div>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Información personal</h3>
          <div className={styles.grid2}>
            <div className={styles.field}>
              <label className={styles.label}>Nombre completo *</label>
              <input className={styles.input} name="name" value={profile.name} onChange={handleChange} placeholder="Tu nombre" required />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Ciudad</label>
              <input className={styles.input} name="city" value={profile.city} onChange={handleChange} placeholder="Barranquilla" />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Correo electrónico *</label>
              <input className={styles.input} type="email" name="email" value={profile.email} onChange={handleChange} placeholder="tu@correo.com" required />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Teléfono</label>
              <input className={styles.input} name="phone" value={profile.phone} onChange={handleChange} placeholder="300 000 0000" />
            </div>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Sobre mí</label>
            <textarea className={`${styles.input} ${styles.textarea}`} name="bio" value={profile.bio} onChange={handleChange}
              placeholder="Cuéntanos quién eres y qué buscas…" rows={3} />
          </div>
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Habilidades</h3>
          <div className={styles.skillInputRow}>
            <input
              className={styles.input} value={skillInput}
              onChange={e => setSkillInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(skillInput); }}}
              placeholder="Escribe una habilidad y presiona Enter…"
            />
            <button type="button" className={styles.addBtn} onClick={() => addSkill(skillInput)}>+ Agregar</button>
          </div>
          <div className={styles.suggestions}>
            {SKILLS_SUGGESTIONS.filter(s => !profile.skills.includes(s)).slice(0, 8).map(s => (
              <button key={s} type="button" className={styles.suggestionChip} onClick={() => addSkill(s)}>{s}</button>
            ))}
          </div>
          {profile.skills.length > 0 && (
            <div className={styles.skillTags} style={{ marginTop: '0.75rem' }}>
              {profile.skills.map(s => (
                <span key={s} className={`${styles.skillTag} ${styles.skillTagRemovable}`}>
                  {s}
                  <button type="button" onClick={() => removeSkill(s)} className={styles.removeSkill}>✕</button>
                </span>
              ))}
            </div>
          )}
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Experiencia</h3>
          <textarea className={`${styles.input} ${styles.textarea}`} name="experience" value={profile.experience} onChange={handleChange}
            placeholder="Describe tu experiencia laboral previa…" rows={4} />
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Educación</h3>
          <textarea className={`${styles.input} ${styles.textarea}`} name="education" value={profile.education || ''} onChange={handleChange}
            placeholder="Ej. Técnico en Sistemas — SENA 2022" rows={3} />
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Redes y Portafolio</h3>
          <div className={styles.grid2}>
            <div className={styles.field}>
              <label className={styles.label}>LinkedIn (URL)</label>
              <input className={styles.input} type="url" name="linkedin" value={profile.linkedin || ''} onChange={handleChange} placeholder="https://linkedin.com/in/tu-perfil" />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>GitHub (URL)</label>
              <input className={styles.input} type="url" name="github" value={profile.github || ''} onChange={handleChange} placeholder="https://github.com/tu-usuario" />
            </div>
          </div>
        </section>

        <button type="submit" className={styles.saveBtn}>Guardar perfil</button>
      </form>
    </div>
  );
};