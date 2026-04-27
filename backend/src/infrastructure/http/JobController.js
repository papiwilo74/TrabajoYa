// backend/src/infrastructure/http/JobController.js

export class JobController {
  constructor(createJobUseCase, getJobsUseCase) {
    this.createJobUseCase = createJobUseCase;
    this.getJobsUseCase = getJobsUseCase;
  }

  // Atiende la petición de publicar vacante (POST)
  createJob(req, res) {
    try {
      const jobData = req.body; // Aquí viene la info del formulario verde
      const newJob = this.createJobUseCase.execute(jobData);
      
      // Respondemos con código 201 (Creado) y los datos
      res.status(201).json(newJob);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Atiende la petición de listar vacantes (GET)
  getJobs(req, res) {
    try {
      const jobs = this.getJobsUseCase.execute();
      
      // Respondemos con código 200 (OK) y la lista
      res.status(200).json(jobs);
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
}