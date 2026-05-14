// backend/src/application/use-cases/GetJobById.js

export class GetJobById {
  constructor(jobRepository) {
    this.jobRepository = jobRepository;
  }

  async execute(id) {
    if (!id) throw new Error('ID requerido.');
    const job = await this.jobRepository.findById(id);
    if (!job) throw new Error('Vacante no encontrada.');
    return job;
  }
}
