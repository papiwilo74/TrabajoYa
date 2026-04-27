import { useEffect, useState } from 'react';

export const JobSearchPage = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    // Le pedimos la lista de empleos al backend
    fetch('http://localhost:3000/api/jobs')
      .then(res => res.json())
      .then(data => setJobs(data))
      .catch(err => console.error('Error cargando empleos:', err));
  }, []);

  return (
    <div>
      <h2>Vacantes Disponibles</h2>
      <p>Encuentra tu próximo empleo ideal en tiempo real.</p>
      
      <div style={{ display: 'grid', gap: '1rem', marginTop: '2rem' }}>
        {jobs.length === 0 ? (
          <p>No hay vacantes publicadas todavía. ¡Sé el primero!</p>
        ) : (
          jobs.map(job => (
            <div key={job.id} style={{ border: '1px solid #ccc', padding: '1.5rem', borderRadius: '8px', backgroundColor: '#fff' }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#1976d2' }}>{job.title}</h3>
              <p style={{ margin: '5px 0' }}><strong>📍 Ubicación:</strong> {job.location}</p>
              <p style={{ margin: '5px 0' }}><strong>📋 Tipo:</strong> {job.type}</p>
              <p style={{ margin: '5px 0' }}><strong>💰 Salario:</strong> {job.salary ? `$${job.salary}` : 'A convenir'}</p>
              <button style={{ marginTop: '15px', padding: '10px 20px', backgroundColor: '#1976d2', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                Postularme
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};