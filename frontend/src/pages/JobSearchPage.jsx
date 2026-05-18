import { useEffect, useState, useCallback } from 'react';
import { JobDetailModal } from '../components/JobDetailModal';
import { ApplicationModal as ApplyModal } from '../components/ApplicationModal';
import styles from './JobSearchPage.module.css';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

const CATEGORIES = ['Todos', 'Tecnología', 'Ventas', 'Construcción', 'Salud', 'Educación', 'General'];

const AVATAR_COLORS = ['#FF5733','#1A1F3C','#7C3AED','#0891B2','#059669','#D97706','#DB2777'];
const getAvatarColor = (title) => AVATAR_COLORS[title.charCodeAt(0) % AVATAR_COLORS.length];

const Highlight = ({ text = '', query = '' }) => {
  if (!query.trim()) return <>{text}</>;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  const parts = text.split(regex);
  return <>{parts.map((p, i) => regex.test(p) ? <mark key={i} className={styles.highlight}>{p}</mark> : p)}</>;
};

const timeAgo = (date) => {
  const diff = Date.now() - new Date(date).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Hoy';
  if (days === 1) return 'Ayer';
  return `Hace ${days} días`;
};

const shareJob = async (job) => {
  const text = ` Vacante: ${job.title} en ${job.location} — TrabajoYa`;
  const url = window.location.href;
  if (navigator.share) {
    try { await navigator.share({ title: job.title, text, url }); return; } catch {}
  }
  await navigator.clipboard.writeText(`${text}\n${url}`);
  alert('¡Enlace copiado! También puedes compartir por WhatsApp:\nhttps://wa.me/?text=' + encodeURIComponent(text));
};

const JobCard = ({ job, query, onViewDetail, onApply, index }) => (
  <article
    className={styles.card}
    style={{ animationDelay: `${index * 0.07}s` }}
    onClick={() => onViewDetail(job)}
    role="button" tabIndex={0}
    onKeyDown={e => e.key === 'Enter' && onViewDetail(job)}
  >
    <div className={styles.cardTop}>
      <div className={styles.avatar} style={{ background: getAvatarColor(job.title) }}>
        {job.title.charAt(0).toUpperCase()}
      </div>
      <div className={styles.cardMeta}>
        <span className={`${styles.badge} ${job.type === 'formal' ? styles.badgeFormal : styles.badgeInformal}`}>
          {job.type}
        </span>
        <span className={styles.timeAgo}>{timeAgo(job.createdAt)}</span>
        <button
          className={styles.shareBtn}
          onClick={e => { e.stopPropagation(); shareJob(job); }}
          title="Compartir vacante"
        >
          
        </button>
      </div>
    </div>

    <h3 className={styles.cardTitle}><Highlight text={job.title} query={query} /></h3>
    <p className={styles.cardDesc}><Highlight text={job.description} query={query} /></p>

    <div className={styles.cardFooter}>
      <div className={styles.cardTags}>
        <span className={styles.tag}> <Highlight text={job.location} query={query} /></span>
        {job.category && job.category !== 'general' && <span className={styles.tag}>{job.category}</span>}
      </div>
      <div className={styles.cardRight}>
        <span className={styles.salary}>
          {job.salary ? `$${Number(job.salary).toLocaleString('es-CO')}` : 'A convenir'}
        </span>
        <button className={styles.applyBtn} onClick={e => { e.stopPropagation(); onApply(job); }}>
          Postularme →
        </button>
      </div>
    </div>
  </article>
);

export const JobSearchPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [salaryRange, setSalaryRange] = useState(0);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applyJob, setApplyJob] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/api/jobs`)
      .then(res => res.json())
      .then(data => { setJobs(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const maxSalary = Math.max(...jobs.map(j => j.salary || 0), 0);

  const countByCategory = useCallback((cat) => {
    if (cat === 'Todos') return jobs.length;
    return jobs.filter(j => j.category?.toLowerCase() === cat.toLowerCase()).length;
  }, [jobs]);

  const filtered = jobs.filter(job => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      job.title.toLowerCase().includes(q) ||
      job.location.toLowerCase().includes(q) ||
      job.description?.toLowerCase().includes(q);
    const matchCat = activeCategory === 'Todos' ||
      job.category?.toLowerCase() === activeCategory.toLowerCase();
    const matchSalary = salaryRange === 0 || (job.salary && job.salary >= salaryRange);
    return matchSearch && matchCat && matchSalary;
  });

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>
          Encuentra tu próximo<br />
          <span className={styles.heroAccent}>empleo en Barranquilla</span>
        </h1>
        <p className={styles.heroSub}>Vacantes formales e informales actualizadas en tiempo real.</p>

        <div className={styles.searchBar}>
          <span className={styles.searchIcon}></span>
          <input
            type="text" placeholder="Cargo, empresa o ciudad…"
            value={search} onChange={e => setSearch(e.target.value)}
            className={styles.searchInput} autoComplete="off"
          />
          {search && <button className={styles.clearBtn} onClick={() => setSearch('')}>✕</button>}
        </div>

        {search && (
          <p className={styles.searchHint}>
            {filtered.length === 0
              ? 'Sin resultados para esa búsqueda'
              : `${filtered.length} resultado${filtered.length !== 1 ? 's' : ''} para "${search}"`}
          </p>
        )}
      </section>

      <div className={styles.filters}>
        {CATEGORIES.map(cat => {
          const count = countByCategory(cat);
          return (
            <button
              key={cat}
              className={`${styles.filterChip} ${activeCategory === cat ? styles.filterActive : ''} ${count === 0 && cat !== 'Todos' ? styles.filterEmpty : ''}`}
              onClick={() => setActiveCategory(cat)}
              disabled={count === 0 && cat !== 'Todos'}
            >
              {cat} <span className={styles.chipCount}>{count}</span>
            </button>
          );
        })}
      </div>

      {maxSalary > 0 && (
        <div className={styles.salaryFilter}>
          <label className={styles.salaryLabel}>
             Salario mínimo:
            <strong> {salaryRange === 0 ? 'Todos' : `$${Number(salaryRange).toLocaleString('es-CO')}`}</strong>
          </label>
          <input
            type="range" min={0} max={maxSalary}
            step={Math.round(maxSalary / 20)}
            value={salaryRange}
            onChange={e => setSalaryRange(Number(e.target.value))}
            className={styles.salarySlider}
          />
          <div className={styles.salaryTicks}>
            <span>$0</span>
            <span>${Number(maxSalary).toLocaleString('es-CO')}</span>
          </div>
          {salaryRange > 0 && (
            <button className={styles.resetSalary} onClick={() => setSalaryRange(0)}>
              Quitar filtro ✕
            </button>
          )}
        </div>
      )}

      <p className={styles.count}>
        {loading ? 'Cargando…' : `${filtered.length} vacante${filtered.length !== 1 ? 's' : ''} disponible${filtered.length !== 1 ? 's' : ''}`}
      </p>

      {loading ? (
        <div className={styles.skeletonGrid}>
          {[1,2,3].map(n => <div key={n} className={styles.skeleton} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}></span>
          <p>No hay vacantes que coincidan.</p>
          <button className={styles.emptyBtn} onClick={() => { setSearch(''); setActiveCategory('Todos'); setSalaryRange(0); }}>
            Ver todas
          </button>
        </div>
      ) : (
        <div className={styles.grid}>
          {filtered.map((job, i) => (
            <JobCard key={job.id} job={job} query={search} index={i}
              onViewDetail={setSelectedJob} onApply={setApplyJob} />
          ))}
        </div>
      )}

      {selectedJob && <JobDetailModal job={selectedJob} onClose={() => setSelectedJob(null)} onApply={() => { setApplyJob(selectedJob); setSelectedJob(null); }} />}
      {applyJob && <ApplyModal job={applyJob} onClose={() => setApplyJob(null)} />}
    </div>
  );
};