// backend/src/infrastructure/http/JobController.js

export class JobController {
  constructor(createJobUseCase, getJobsUseCase) {
    this.createJobUseCase = createJobUseCase;
    this.getJobsUseCase   = getJobsUseCase;
  }

  // POST /api/jobs
  async createJob(req, res) {
    try {
      const newJob = await this.createJobUseCase.execute(req.body);
      res.status(201).json(newJob);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // GET /api/jobs?location=Barranquilla&category=tecnología
  async getJobs(req, res) {
    try {
      const { location, category } = req.query;
      const jobs = await this.getJobsUseCase.execute({ location, category });
      res.status(200).json(jobs);
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor.' });
    }
  }

  // GET /api/jobs/:id
  async getJobById(req, res) {
    try {
      const job = await this.getJobsUseCase.jobRepository?.findById(req.params.id);
      if (!job) return res.status(404).json({ error: 'Vacante no encontrada.' });
      res.status(200).json(job);
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor.' });
    }
  }
}