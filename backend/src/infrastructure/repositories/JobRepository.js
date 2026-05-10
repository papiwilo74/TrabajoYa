// backend/src/infrastructure/repositories/JobRepository.js

export class JobRepository {
  constructor() {
    this.jobs = [];
  }

  // Guarda una vacante (compatible con la interfaz TS: devuelve la vacante)
  save(job) {
    this.jobs.push(job);
    return job;
  }

  // Devuelve todas las vacantes abiertas
  findAll() {
    return this.jobs.filter(job => job.status === 'open');
  }

  // Busca por ID
  findById(id) {
    return this.jobs.find(job => job.id === id) ?? null;
  }

  // Filtra por ciudad (para escalar con Supabase luego)
  findByLocation(location) {
    return this.jobs.filter(
      job => job.location.toLowerCase().includes(location.toLowerCase()) && job.status === 'open'
    );
  }

  // Filtra por categoría
  findByCategory(category) {
    return this.jobs.filter(
      job => job.category?.toLowerCase() === category.toLowerCase() && job.status === 'open'
    );
  }
}