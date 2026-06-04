// backend/src/application/use-cases/GetApplicationsByJobId.js

export class GetApplicationsByJobId {
  constructor(applicationRepository) {
    this.applicationRepository = applicationRepository;
  }

  async execute(jobId) {
    if (!jobId) {
      throw new Error('jobId es requerido.');
    }
    return await this.applicationRepository.findByJobId(jobId);
  }
}
