// backend/index.js
import express from 'express';
import cors from 'cors';

// Importamos nuestras capas
import { JobRepository } from './src/infrastructure/repositories/JobRepository.js';
import { CreateJob } from './src/application/use-cases/CreateJob.js';
import { GetJobs } from './src/application/use-cases/GetJobs.js';
import { JobController } from './src/infrastructure/http/JobController.js';

const app = express();

// Middlewares obligatorios
app.use(cors()); // Permite que React (puerto 5173) se conecte
app.use(express.json()); // Permite entender los datos del formulario

// --- INYECCIÓN DE DEPENDENCIAS ---
const jobRepository = new JobRepository();
const createJobUseCase = new CreateJob(jobRepository);
const getJobsUseCase = new GetJobs(jobRepository);
const jobController = new JobController(createJobUseCase, getJobsUseCase);

// --- RUTAS HTTP ---
app.get('/api/jobs', (req, res) => jobController.getJobs(req, res));
app.post('/api/jobs', (req, res) => jobController.createJob(req, res));

// --- ENCENDIDO DEL SERVIDOR ---
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor backend encendido y escuchando en http://localhost:${PORT}`);
});