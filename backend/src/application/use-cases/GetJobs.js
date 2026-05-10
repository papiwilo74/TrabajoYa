// backend/src/application/use-cases/GetJobs.js

export class GetJobs {
  constructor(jobRepository) {
    this.jobRepository = jobRepository;
  }

  execute({ location, category } = {}) {
    if (location) {
      return this.jobRepository.findByLocation(location);
    }
    if (category) {
      return this.jobRepository.findByCategory(category);
    }
    return this.jobRepository.findAll();
  }
}