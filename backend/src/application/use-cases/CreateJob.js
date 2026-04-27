// backend/src/application/use-cases/CreateJob.js
import { Job } from '../../domain/entities/Job.js';

export class CreateJob {
  // Recibimos el repositorio (nuestra base de datos simulada)
  constructor(jobRepository) {
    this.jobRepository = jobRepository;
  }

  // Ejecutamos la acción de crear la vacante
  execute(jobData) {
    // 1. Validaciones de negocio simples
    if (!jobData.title || !jobData.location) {
      throw new Error('El título y la ubicación son obligatorios para publicar una vacante.');
    }

    // 2. Crear la nueva Entidad Job (generamos un ID falso con Date.now por ahora)
    const newJob = new Job(
      Date.now().toString(), 
      jobData.employerId || 'empresa-123', // Simulamos qué empresa lo publica
      jobData.title,
      jobData.description,
      jobData.type,
      jobData.location,
      jobData.salary
    );

    // 3. Guardar en el repositorio y devolver la vacante creada
    return this.jobRepository.save(newJob);
  }
}