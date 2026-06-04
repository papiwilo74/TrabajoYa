import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './RegisterPage.module.css';

export const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('candidate'); // candidate | employer
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await register(name, email, password, role);
      if (role === 'employer') {
        navigate('/empresa/dashboard');
      } else {
        navigate('/candidato/buscar');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <Link to="/" className={styles.logo}>
            <span className={styles.logoMark}>TY</span>
            <span className={styles.logoText}>TrabajoYa</span>
          </Link>
          <h1 className={styles.title}>Crear cuenta</h1>
          <p className={styles.sub}>Únete a la plataforma para buscar ofertas o publicar vacantes</p>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        {/* Role Selection Tabs */}
        <div className={styles.roleTabs}>
          <button
            type="button"
            className={`${styles.roleTab} ${role === 'candidate' ? styles.activeRoleTab : ''}`}
            onClick={() => setRole('candidate')}
          >
            <span>🙋‍♂️ Soy Candidato</span>
            <span className={styles.roleDesc}>Busco empleo</span>
          </button>
          <button
            type="button"
            className={`${styles.roleTab} ${role === 'employer' ? styles.activeRoleTab : ''}`}
            onClick={() => setRole('employer')}
          >
            <span>🏢 Soy Empresa</span>
            <span className={styles.roleDesc}>Busco talento</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>
              {role === 'candidate' ? 'Nombre completo' : 'Nombre de la empresa'}
            </label>
            <input
              type="text"
              className={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={role === 'candidate' ? 'Ej. María García' : 'Ej. Empresa S.A.S.'}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Correo electrónico</label>
            <input
              type="email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Contraseña</label>
            <input
              type="password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              minLength={6}
              required
            />
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? <span className={styles.spinner} /> : 'Registrarme'}
          </button>
        </form>

        <div className={styles.footer}>
          <span>¿Ya tienes una cuenta?</span>{' '}
          <Link to="/login" className={styles.link}>
            Inicia sesión
          </Link>
        </div>
      </div>
    </div>
  );
};
