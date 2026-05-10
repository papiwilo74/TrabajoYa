import { Job } from '../../domain/entities/Job';
import { JobRepository } from '../../domain/repositories/JobRepository';

export class GetJobsByLocationUseCase {
  constructor(private jobRepository: JobRepository) {}

  // Si no le pasamos ciudad, buscará en Barranquilla por defecto
  async execute(location: string = 'Barranquilla'): Promise<Job[]> {
    return await this.jobRepository.findByLocation(location);
  }
}