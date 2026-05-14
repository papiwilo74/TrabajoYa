-- ============================================================
-- TrabajoYa - Schema de Supabase
-- Ejecuta este script en: Supabase > SQL Editor > New query
-- ============================================================

-- Tabla de usuarios
create table if not exists users (
  id         uuid        primary key default gen_random_uuid(),
  name       text        not null,
  email      text        unique not null,
  role       text        not null check (role in ('candidate', 'employer')),
  created_at timestamptz default now()
);

-- Tabla de vacantes
create table if not exists jobs (
  id          text        primary key,
  employer_id text        not null default 'empresa-demo',
  title       text        not null,
  description text        not null,
  type        text        not null check (type in ('formal', 'informal')),
  category    text        not null default 'general',
  location    text        not null,
  salary      numeric     check (salary >= 0),
  status      text        not null default 'open' check (status in ('open', 'closed')),
  created_at  timestamptz default now()
);

-- Tabla de postulaciones
create table if not exists applications (
  id              uuid        primary key default gen_random_uuid(),
  job_id          text        not null references jobs(id) on delete cascade,
  candidate_name  text        not null,
  candidate_email text        not null,
  candidate_phone text,
  message         text,
  created_at      timestamptz default now()
);

-- Indices para consultas frecuentes
create index if not exists jobs_status_idx    on jobs (status);
create index if not exists jobs_category_idx  on jobs (category);
create index if not exists jobs_location_idx  on jobs (location);
create index if not exists apps_job_id_idx    on applications (job_id);

-- Politicas de seguridad (Row Level Security)
-- Por ahora deshabilitadas para que el service key del backend tenga acceso total.
-- Cuando implementes autenticacion, activalas y ajusta las reglas.
alter table jobs         disable row level security;
alter table applications disable row level security;
alter table users        disable row level security;
