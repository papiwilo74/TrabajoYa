// backend/src/application/use-cases/GetJobs.js

export class GetJobs {
  constructor(jobRepository) {
    this.jobRepository = jobRepository;
  }

  async execute({ location, category } = {}) {
    if (location) return await this.jobRepository.findByLocation(location);
    if (category) return await this.jobRepository.findByCategory(category);
    return await this.jobRepository.findAll();
  }
}