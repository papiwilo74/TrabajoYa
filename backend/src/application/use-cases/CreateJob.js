// backend/src/application/use-cases/CreateJob.js
import { Job } from '../../domain/entities/Job.js';

export class CreateJob {
  constructor(jobRepository) {
    this.jobRepository = jobRepository;
  }

  execute(jobData) {
    // Validaciones de negocio
    if (!jobData.title?.trim()) {
      throw new Error('El título de la vacante es obligatorio.');
    }
    if (!jobData.location?.trim()) {
      throw new Error('La ubicación es obligatoria.');
    }
    if (!jobData.description?.trim()) {
      throw new Error('La descripción es obligatoria.');
    }

    const newJob = new Job(
      // ID único sin dependencias externas
      `job_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      jobData.employerId ?? 'empresa-demo',
      jobData.title.trim(),
      jobData.description.trim(),
      jobData.type ?? 'formal',
      jobData.category ?? 'general',
      jobData.location.trim(),
      jobData.salary ? Number(jobData.salary) : null
    );

    return this.jobRepository.save(newJob);
  }
}