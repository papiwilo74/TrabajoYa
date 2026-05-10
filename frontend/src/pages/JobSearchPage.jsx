/* frontend/src/pages/JobSearchPage.jsx */
import { useEffect, useState } from 'react';
import styles from './JobSearchPage.module.css';

const CATEGORIES = ['Todos', 'Tecnología', 'Ventas', 'Construcción', 'Salud', 'Educación', 'General'];

const JobCard = ({ job }) => {
  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return 'Hoy';
    if (days === 1) return 'Ayer';
    return `Hace ${days} días`;
  };

  return (
    <article className={styles.card}>
      <div className={styles.cardTop}>
        <div className={styles.avatar}>
          {job.title.charAt(0).toUpperCase()}
        </div>
        <div className={styles.cardMeta}>
          <span className={`${styles.badge} ${job.type === 'formal' ? styles.badgeFormal : styles.badgeInformal}`}>
            {job.type}
          </span>
          <span className={styles.timeAgo}>{timeAgo(job.createdAt)}</span>
        </div>
      </div>

      <h3 className={styles.cardTitle}>{job.title}</h3>
      <p className={styles.cardDesc}>{job.description}</p>

      <div className={styles.cardFooter}>
        <div className={styles.cardTags}>
          <span className={styles.tag}>📍 {job.location}</span>
          {job.category && job.category !== 'general' && (
            <span className={styles.tag}>{job.category}</span>
          )}
        </div>
        <div className={styles.cardRight}>
          <span className={styles.salary}>
            {job.salary ? `$${Number(job.salary).toLocaleString('es-CO')}` : 'A convenir'}
          </span>
          <button className={styles.applyBtn}>Postularme →</button>
        </div>
      </div>
    </article>
  );
};

export const JobSearchPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');

  useEffect(() => {
    fetch('http://localhost:3000/api/jobs')
      .then(res => res.json())
      .then(data => { setJobs(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = jobs.filter(job => {
    const matchSearch =
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.location.toLowerCase().includes(search.toLowerCase()) ||
      job.description?.toLowerCase().includes(search.toLowerCase());

    const matchCat =
      activeCategory === 'Todos' ||
      job.category?.toLowerCase() === activeCategory.toLowerCase();

    return matchSearch && matchCat;
  });

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>
          Encuentra tu próximo<br />
          <span className={styles.heroAccent}>empleo en Barranquilla</span>
        </h1>
        <p className={styles.heroSub}>
          Vacantes formales e informales actualizadas en tiempo real.
        </p>

        <div className={styles.searchBar}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Cargo, empresa o ciudad…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className={styles.searchInput}
          />
          {search && (
            <button className={styles.clearBtn} onClick={() => setSearch('')}>✕</button>
          )}
        </div>
      </section>

      {/* Filtros */}
      <div className={styles.filters}>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`${styles.filterChip} ${activeCategory === cat ? styles.filterActive : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Contador */}
      <p className={styles.count}>
        {loading ? 'Cargando…' : `${filtered.length} vacante${filtered.length !== 1 ? 's' : ''} disponible${filtered.length !== 1 ? 's' : ''}`}
      </p>

      {/* Grid de cards */}
      {loading ? (
        <div className={styles.skeletonGrid}>
          {[1, 2, 3].map(n => <div key={n} className={styles.skeleton} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>🗂️</span>
          <p>No hay vacantes que coincidan con tu búsqueda.</p>
          <button className={styles.emptyBtn} onClick={() => { setSearch(''); setActiveCategory('Todos'); }}>
            Ver todas
          </button>
        </div>
      ) : (
        <div className={styles.grid}>
          {filtered.map(job => <JobCard key={job.id} job={job} />)}
        </div>
      )}
    </div>
  );
};