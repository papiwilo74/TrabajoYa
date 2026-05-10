// backend/index.js
import express from 'express';
import cors from 'cors';

import { JobRepository } from './src/infrastructure/repositories/JobRepository.js';
import { CreateJob } from './src/application/use-cases/CreateJob.js';
import { GetJobs } from './src/application/use-cases/GetJobs.js';
import { JobController } from './src/infrastructure/http/JobController.js';

const app = express();

app.use(cors());
app.use(express.json());

// --- Inyección de dependencias ---
const jobRepository = new JobRepository();
const createJobUseCase = new CreateJob(jobRepository);
const getJobsUseCase = new GetJobs(jobRepository);
const jobController = new JobController(createJobUseCase, getJobsUseCase);

// Adjuntamos el repositorio al use case para poder usarlo en getJobById
getJobsUseCase.jobRepository = jobRepository;

// --- Rutas ---
app.get('/api/jobs', (req, res) => jobController.getJobs(req, res));
app.post('/api/jobs', (req, res) => jobController.createJob(req, res));
app.get('/api/jobs/:id', (req, res) => jobController.getJobById(req, res));

// Health check (útil para Vercel/Railway)
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => {
  console.log(`✅ Backend corriendo en http://localhost:${PORT}`);
});