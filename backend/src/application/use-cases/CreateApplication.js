// backend/src/application/use-cases/CreateApplication.js

export class CreateApplication {
  constructor(applicationRepository, jobRepository) {
    this.applicationRepository = applicationRepository;
    this.jobRepository = jobRepository;
  }

  async execute(data) {
    if (!data.jobId) throw new Error('jobId es requerido.');
    if (!data.candidateName?.trim()) throw new Error('El nombre es requerido.');
    if (!data.candidateEmail?.trim()) throw new Error('El correo es requerido.');

    // Verificar que la vacante existe y está abierta
    const job = await this.jobRepository.findById(data.jobId);
    if (!job) throw new Error('La vacante no existe.');
    if (job.status !== 'open') throw new Error('Esta vacante ya no está disponible.');

    return await this.applicationRepository.save({
      jobId: data.jobId,
      candidateName: data.candidateName.trim(),
      candidateEmail: data.candidateEmail.trim(),
      candidatePhone: data.candidatePhone?.trim() ?? null,
      message: data.message?.trim() ?? null,
    });
  }
}
