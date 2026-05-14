# Guia de despliegue - TrabajoYa

## Resumen de la arquitectura

  Frontend (React + Vite)  -->  Vercel
  Backend (Node + Express) -->  Railway
  Base de datos            -->  Supabase


## PASO 1 - Supabase

1. Crea una cuenta en https://supabase.com
2. Crea un nuevo proyecto (guarda la contrasena, la necesitaras)
3. Ve a: SQL Editor > New query
4. Pega y ejecuta el contenido de `supabase-schema.sql`
5. Ve a: Project Settings > API
6. Copia estos dos valores:
   - Project URL  --> este es tu SUPABASE_URL
   - service_role key (secret) --> este es tu SUPABASE_SERVICE_KEY
   Nota: NO uses la anon key en el backend, usa la service_role key


## PASO 2 - Railway (backend)

1. Crea una cuenta en https://railway.app
2. Haz clic en "New Project" > "Deploy from GitHub repo"
3. Conecta tu repositorio de GitHub
4. Railway detecta que hay un `package.json` en /backend
   Si no lo detecta automaticamente, configura:
   - Root Directory: backend
   - Start command:  node index.js
5. Ve a la seccion "Variables" de tu servicio y agrega:

   SUPABASE_URL         = https://xxxx.supabase.co
   SUPABASE_SERVICE_KEY = tu-service-role-key
   FRONTEND_URL         = https://trabajoya.vercel.app   (lo tendras en el paso 3)
   PORT                 = 3000

6. Despliega. Railway te dara una URL como:
   https://trabajoya-backend.up.railway.app
   Guardala para el siguiente paso.

7. Verifica que funciona abriendo en el navegador:
   https://tu-backend.up.railway.app/api/health
   Debe responder: { "status": "ok" }


## PASO 3 - Vercel (frontend)

1. Crea una cuenta en https://vercel.com
2. Haz clic en "Add New Project" > importa tu repositorio de GitHub
3. Configura el proyecto:
   - Framework Preset: Vite
   - Root Directory:   frontend
   - Build command:    npm run build   (Vercel lo detecta solo)
   - Output directory: dist            (Vercel lo detecta solo)
4. Antes de hacer clic en Deploy, ve a "Environment Variables" y agrega:

   VITE_API_URL = https://tu-backend.up.railway.app

5. Haz clic en Deploy.
6. Vercel te dara una URL como:
   https://trabajoya.vercel.app

7. Vuelve a Railway y actualiza la variable FRONTEND_URL con esa URL de Vercel.
   Esto es importante para que el CORS del backend acepte peticiones del frontend.


## PASO 4 - Actualizar el CORS en el backend

Abre backend/index.js y reemplaza la linea del dominio de Vercel con tu URL real:

  'https://trabajoya.vercel.app',   <-- cambia esto por tu URL de Vercel

Haz commit y push. Railway redesplegara automaticamente.


## Estructura de archivos modificados en esta actualizacion

  backend/
    index.js                                         (CORS restringido, async/await)
    package.json                                     (agrega @supabase/supabase-js y dotenv)
    .env.example                                     (variables necesarias)
    src/infrastructure/supabaseClient.js             (NUEVO - cliente de Supabase)
    src/infrastructure/repositories/JobRepository.js         (conectado a Supabase)
    src/infrastructure/repositories/UserRepository.js        (conectado a Supabase)
    src/infrastructure/repositories/ApplicationRepository.js (NUEVO)
    src/infrastructure/http/JobController.js                  (async/await, ruta applications)
    src/application/use-cases/GetJobById.js                   (NUEVO - caso de uso propio)
    src/application/use-cases/CreateApplication.js            (NUEVO)
    src/application/use-cases/CreateJob.js                    (async/await, validacion de salario)
    src/application/use-cases/GetJobs.js                      (async/await)

  frontend/
    src/services/api.js                              (NUEVO - todas las llamadas al backend)
    src/pages/JobSearchPage.jsx                      (usa api.js, manejo de errores)
    src/pages/CreateJobPage.jsx                      (usa api.js)
    src/pages/EmployerDashboardPage.jsx              (usa api.js, manejo de errores)
    src/components/ApplicationModal.jsx              (postulacion real, no simulada)
    .env.local                                       (desarrollo local)
    .env.production                                  (produccion - Vercel)
    .env.example                                     (referencia)

  supabase-schema.sql                                (NUEVO - ejecutar en Supabase)


## Comandos para instalar dependencias nuevas

  # Backend
  cd backend
  npm install

  # Frontend (no hay dependencias nuevas)
  cd frontend
  npm install


## Verificacion local antes de desplegar

  # Terminal 1 - backend
  cd backend
  cp .env.example .env
  # edita .env con tus credenciales de Supabase
  npm run dev

  # Terminal 2 - frontend
  cd frontend
  npm run dev

  Abre http://localhost:5173 y verifica que las vacantes cargan desde Supabase.
