// frontend/src/services/api.js
// Punto único de contacto con el backend.
// Todas las llamadas pasan por aquí — nunca más fetch('http://localhost:...')

const BASE_URL = import.meta.env.VITE_API_URL;

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });

  // Para respuestas sin cuerpo (204, etc.)
  if (res.status === 204) return null;

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error ?? `Error ${res.status}`);
  }

  return data;
}

// ── Jobs ──
export const getJobs = (params = {}) => {
  const qs = new URLSearchParams(
    Object.fromEntries(Object.entries(params).filter(([, v]) => v))
  ).toString();
  return request(`/api/jobs${qs ? `?${qs}` : ''}`);
};

export const getJobById = (id) => request(`/api/jobs/${id}`);

export const createJob = (body) =>
  request('/api/jobs', { method: 'POST', body: JSON.stringify(body) });

// ── Applications ──
export const createApplication = (body) =>
  request('/api/applications', { method: 'POST', body: JSON.stringify(body) });
