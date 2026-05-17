// backend/index.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import { JobRepository }         from './src/infrastructure/repositories/JobRepository.js';
import { ApplicationRepository } from './src/infrastructure/repositories/ApplicationRepository.js'; // ✓ nuevo
import { CreateJob }             from './src/application/use-cases/CreateJob.js';
import { GetJobs }               from './src/application/use-cases/GetJobs.js';
import { CreateApplication }     from './src/application/use-cases/CreateApplication.js'; // ✓ nuevo
import { JobController }         from './src/infrastructure/http/JobController.js';

const app = express();

// ✓ Fix 5: CORS restringido al dominio del frontend en producción
const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Permitir peticiones sin origin (ej. curl, Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`Origen no permitido por CORS: ${origin}`));
  },
}));

app.use(express.json());

// --- Inyección de dependencias ---
const jobRepository         = new JobRepository();
const applicationRepository = new ApplicationRepository(); // ✓ nuevo
const createJobUseCase      = new CreateJob(jobRepository);
const getJobsUseCase        = new GetJobs(jobRepository);
const createApplicationUseCase = new CreateApplication(applicationRepository, jobRepository); // ✓ nuevo
const jobController         = new JobController(createJobUseCase, getJobsUseCase);

// Adjuntamos el repositorio al use case para poder usarlo en getJobById
getJobsUseCase.jobRepository = jobRepository;

// --- Rutas jobs ---
app.get('/api/jobs',     (req, res) => jobController.getJobs(req, res));
app.post('/api/jobs',    (req, res) => jobController.createJob(req, res));
app.get('/api/jobs/:id', (req, res) => jobController.getJobById(req, res));

// ✓ Fix 3: ruta de postulaciones ahora existe
app.post('/api/applications', async (req, res) => {
  try {
    const result = await createApplicationUseCase.execute(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Health check
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => {
  console.log(`✅ Backend corriendo en http://localhost:${PORT}`);
});