// backend/index.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import { JobRepository }         from './src/infrastructure/repositories/JobRepository.js';
import { ApplicationRepository } from './src/infrastructure/repositories/ApplicationRepository.js';
import { CreateJob }             from './src/application/use-cases/CreateJob.js';
import { GetJobs }               from './src/application/use-cases/GetJobs.js';
import { CreateApplication }     from './src/application/use-cases/CreateApplication.js';
import { GetApplicationsByJobId } from './src/application/use-cases/GetApplicationsByJobId.js';
import { JobController }         from './src/infrastructure/http/JobController.js';
import { UserRepository }        from './src/infrastructure/repositories/UserRepository.js';
import { supabase }              from './src/infrastructure/supabaseClient.js';

// ── Validar variables de entorno al arrancar ──────────────────────────────────
const requiredEnvVars = ['SUPABASE_URL', 'SUPABASE_SERVICE_KEY'];
const missingVars = requiredEnvVars.filter((v) => !process.env[v]);

if (missingVars.length > 0) {
  console.error(' Faltan variables de entorno:', missingVars.join(', '));
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
const getApplicationsByJobIdUseCase = new GetApplicationsByJobId(applicationRepository);
const userRepository           = new UserRepository();
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

// ── Middleware de Autenticación ───────────────────────────────────────────────
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token de acceso no proporcionado.' });
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      return res.status(403).json({ error: 'Token inválido o expirado.' });
    }

    const dbUser = await userRepository.findById(user.id);
    if (!dbUser) {
      return res.status(403).json({ error: 'Perfil de usuario no encontrado.' });
    }

    req.user = dbUser;
    next();
  } catch (err) {
    return res.status(500).json({ error: 'Error interno en la autenticación.' });
  }
};

// ── Rutas de Autenticación ───────────────────────────────────────────────────
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: 'Todos los campos son requeridos.' });
  }
  if (role !== 'candidate' && role !== 'employer') {
    return res.status(400).json({ error: 'Rol inválido.' });
  }

  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw new Error(authError.message);
    if (!authData.user) throw new Error('No se pudo crear el usuario.');

    const profile = await userRepository.save({
      id: authData.user.id,
      name,
      email,
      role,
    });

    res.status(201).json({
      message: 'Usuario registrado con éxito.',
      user: profile,
      token: authData.session?.access_token || null
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Correo y contraseña son requeridos.' });
  }

  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) throw new Error(authError.message);

    const dbUser = await userRepository.findById(authData.user.id);
    if (!dbUser) {
      throw new Error('Perfil de usuario no encontrado.');
    }

    res.status(200).json({
      message: 'Inicio de sesión exitoso.',
      token: authData.session.access_token,
      user: {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        role: dbUser.role,
      },
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ── Rutas de Empleos (Jobs) ───────────────────────────────────────────────────
app.get('/api/jobs',     (req, res) => jobController.getJobs(req, res));
app.get('/api/jobs/:id', (req, res) => jobController.getJobById(req, res));

// Crear vacante — Solo empresas autenticadas
app.post('/api/jobs', authenticateToken, async (req, res) => {
  if (req.user.role !== 'employer') {
    return res.status(403).json({ error: 'Acceso restringido a empresas.' });
  }
  // Asignar el ID de la empresa autenticada
  req.body.employerId = req.user.id;
  return jobController.createJob(req, res);
});

// Obtener vacantes del empleador logueado
app.get('/api/employer/jobs', authenticateToken, async (req, res) => {
  if (req.user.role !== 'employer') {
    return res.status(403).json({ error: 'Acceso restringido a empresas.' });
  }
  try {
    const jobs = await jobRepository.findByEmployerId(req.user.id);
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener postulaciones de una vacante — Solo el empleador dueño de la vacante
app.get('/api/jobs/:id/applications', authenticateToken, async (req, res) => {
  if (req.user.role !== 'employer') {
    return res.status(403).json({ error: 'Solo las empresas pueden ver postulaciones.' });
  }
  try {
    const job = await jobRepository.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ error: 'Vacante no encontrada.' });
    }
    if (job.employerId !== req.user.id) {
      return res.status(403).json({ error: 'No tienes permiso para ver los candidatos de esta vacante.' });
    }

    const apps = await getApplicationsByJobIdUseCase.execute(req.params.id);
    const mapped = apps.map(a => ({
      id: a.id,
      jobId: a.job_id,
      candidateName: a.candidate_name,
      candidateEmail: a.candidate_email,
      candidatePhone: a.candidate_phone,
      message: a.message,
      createdAt: a.created_at
    }));
    res.json(mapped);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// ── Rutas de Postulaciones (Applications) ─────────────────────────────────────
// Crear postulación — Solo candidatos autenticados
app.post('/api/applications', authenticateToken, async (req, res) => {
  if (req.user.role !== 'candidate') {
    return res.status(403).json({ error: 'Solo los candidatos pueden postularse.' });
  }
  
  // Forzar que los datos del postulante coincidan con su cuenta registrada
  req.body.candidateName = req.user.name;
  req.body.candidateEmail = req.user.email;

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
  console.log(` Backend corriendo en http://localhost:${PORT}`);
  console.log(` Verifica la conexión con Supabase abriendo:`);
  console.log(`   http://localhost:${PORT}/api/health`);
  console.log(` Para ver las vacantes:`);
  console.log(`   http://localhost:${PORT}/api/jobs`);
});