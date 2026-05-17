// backend/index.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import { JobRepository }         from './src/infrastructure/repositories/JobRepository.js';
import { ApplicationRepository } from './src/infrastructure/repositories/ApplicationRepository.js';
import { CreateJob }             from './src/application/use-cases/CreateJob.js';
import { GetJobs }               from './src/application/use-cases/GetJobs.js';
import { CreateApplication }     from './src/application/use-cases/CreateApplication.js';
import { JobController }         from './src/infrastructure/http/JobController.js';

// ── Validar variables de entorno al arrancar ──────────────────────────────────
const requiredEnvVars = ['SUPABASE_URL', 'SUPABASE_SERVICE_KEY'];
const missingVars = requiredEnvVars.filter((v) => !process.env[v]);

if (missingVars.length > 0) {
  console.error('❌ Faltan variables de entorno:', missingVars.join(', '));
  console.error('   Crea el archivo backend/.env copiando backend/.env.example');
  console.error('   y rellena los valores de tu proyecto en Supabase.');
  process.exit(1);
}

const app = express();

// ── CORS ──────────────────────────────────────────────────────────────────────
const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Permitir peticiones sin origin (curl, Postman, Railway health checks)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`Origen no permitido por CORS: ${origin}`));
    },
  })
);

app.use(express.json());

// ── Inyección de dependencias ─────────────────────────────────────────────────
const jobRepository            = new JobRepository();
const applicationRepository    = new ApplicationRepository();
const createJobUseCase         = new CreateJob(jobRepository);
const getJobsUseCase           = new GetJobs(jobRepository);
const createApplicationUseCase = new CreateApplication(applicationRepository, jobRepository);
const jobController            = new JobController(createJobUseCase, getJobsUseCase);

// Exponemos el repositorio en el use-case para poder usarlo en getJobById
getJobsUseCase.jobRepository = jobRepository;

// ── Rutas ─────────────────────────────────────────────────────────────────────

// Health check — úsalo para verificar que el servidor y Supabase están ok
app.get('/api/health', async (_req, res) => {
  try {
    // Hacemos una consulta mínima para verificar la conexión con Supabase
    const jobs = await jobRepository.findAll();
    res.json({
      status: 'ok',
      supabase: 'conectado',
      vacantes_en_db: jobs.length,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      supabase: 'fallo de conexión',
      detalle: error.message,
    });
  }
});

// Jobs
app.get('/api/jobs',     (req, res) => jobController.getJobs(req, res));
app.post('/api/jobs',    (req, res) => jobController.createJob(req, res));
app.get('/api/jobs/:id', (req, res) => jobController.getJobById(req, res));

// Postulaciones
app.post('/api/applications', async (req, res) => {
  try {
    const result = await createApplicationUseCase.execute(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ── Arranque ──────────────────────────────────────────────────────────────────
const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
  console.log(`✅ Backend corriendo en http://localhost:${PORT}`);
  console.log(`🔍 Verifica la conexión con Supabase abriendo:`);
  console.log(`   http://localhost:${PORT}/api/health`);
  console.log(`📋 Para ver las vacantes:`);
  console.log(`   http://localhost:${PORT}/api/jobs`);
});