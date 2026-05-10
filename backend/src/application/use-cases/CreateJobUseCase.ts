import { Job, JobType } from '../../domain/entities/Job';
import { JobRepository } from '../../domain/repositories/JobRepository';

export class CreateJobUseCase {
  // Inyectamos el repositorio. No nos importa si es Supabase o memoria, solo que cumpla el contrato.
  constructor(private jobRepository: JobRepository) {}

  async execute(
    employerId: string,
    title: string,
    description: string,
    type: JobType,
    category: string,
    location: string
  ): Promise<Job> {
    
    // Validación básica
    if (!title || !description) {
      throw new Error('El título y la descripción son obligatorios para publicar la vacante.');
    }

    // Creamos la entidad
    const newJob = new Job(
      crypto.randomUUID(), // Genera un ID único automáticamente
      employerId,
      title,
      description,
      type,
      category,
      location,
      new Date()
    );

    // Usamos el repositorio para guardar
    await this.jobRepository.save(newJob);
    
    return newJob;
  }
}