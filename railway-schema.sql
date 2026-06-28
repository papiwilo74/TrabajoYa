-- ============================================================
-- TrabajoYa - Schema para PostgreSQL (Railway)
-- ============================================================

-- Tabla de usuarios (con auth nativo)
CREATE TABLE IF NOT EXISTS users (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text        NOT NULL,
  email         text        UNIQUE NOT NULL,
  password_hash text        NOT NULL,
  role          text        NOT NULL CHECK (role IN ('candidate', 'employer')),
  created_at    timestamptz DEFAULT NOW()
);

-- Tabla de vacantes
CREATE TABLE IF NOT EXISTS jobs (
  id          text        PRIMARY KEY,
  employer_id uuid        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title       text        NOT NULL,
  description text        NOT NULL,
  type        text        NOT NULL CHECK (type IN ('formal', 'informal')),
  category    text        NOT NULL DEFAULT 'general',
  location    text        NOT NULL,
  salary      numeric     CHECK (salary >= 0),
  status      text        NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed')),
  created_at  timestamptz DEFAULT NOW()
);

-- Tabla de postulaciones
CREATE TABLE IF NOT EXISTS applications (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id          text        NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  candidate_name  text        NOT NULL,
  candidate_email text        NOT NULL,
  candidate_phone text,
  message         text,
  created_at      timestamptz DEFAULT NOW()
);

-- Indices para consultas frecuentes
CREATE INDEX IF NOT EXISTS jobs_status_idx    ON jobs (status);
CREATE INDEX IF NOT EXISTS jobs_category_idx  ON jobs (category);
CREATE INDEX IF NOT EXISTS jobs_location_idx  ON jobs (location);
CREATE INDEX IF NOT EXISTS apps_job_id_idx    ON applications (job_id);
