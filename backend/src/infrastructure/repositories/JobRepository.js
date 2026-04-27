// backend/src/infrastructure/repositories/JobRepository.js

export class JobRepository {
  constructor() {
    // Arreglo para simular la tabla de vacantes
    this.jobs = [];
  }

  // Método para que un empleador publique una vacante
  save(job) {
    this.jobs.push(job);
    console.log(`Vacante '${job.title}' publicada con éxito.`);
    return job;
  }

  // Método para obtener todas las vacantes (para la pantalla de búsqueda)
  findAll() {
    return this.jobs;
  }

  // Método para filtrar empleos por tipo (formal o informal)
  findByType(type) {
    return this.jobs.filter(job => job.type === type);
  }
}