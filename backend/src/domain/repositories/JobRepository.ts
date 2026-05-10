import { Job } from '../entities/Job';

export interface JobRepository {
  save(job: Job): Promise<void>;
  findAll(): Promise<Job[]>;
  findById(id: string): Promise<Job | null>;
  findByLocation(location: string): Promise<Job[]>; // Para filtrar por "Barranquilla"
}