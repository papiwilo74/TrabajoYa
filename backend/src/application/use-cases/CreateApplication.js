// backend/src/application/use-cases/CreateApplication.js
import { sendApplicationConfirmation, sendEmployerNotification } from '../../infrastructure/email/emailService.js';

export class CreateApplication {
  constructor(applicationRepository, jobRepository, userRepository) {
    this.applicationRepository = applicationRepository;
    this.jobRepository = jobRepository;
    this.userRepository = userRepository; // ← nuevo
  }

  async execute(data) {
    if (!data.jobId) throw new Error('jobId es requerido.');
    if (!data.candidateName?.trim()) throw new Error('El nombre es requerido.');
    if (!data.candidateEmail?.trim()) throw new Error('El correo es requerido.');

    const job = await this.jobRepository.findById(data.jobId);
    if (!job) throw new Error('La vacante no existe.');
    if (job.status !== 'open') throw new Error('Esta vacante ya no está disponible.');

    const result = await this.applicationRepository.save({
      jobId: data.jobId,
      candidateName: data.candidateName.trim(),
      candidateEmail: data.candidateEmail.trim(),
      candidatePhone: data.candidatePhone?.trim() ?? null,
      message: data.message?.trim() ?? null,
    });

    // Emails en paralelo — no bloquean la respuesta
    const employer = job.employerId
      ? await this.userRepository.findById(job.employerId).catch(() => null)
      : null;

    await Promise.allSettled([
      sendApplicationConfirmation({
        candidateName: data.candidateName.trim(),
        candidateEmail: data.candidateEmail.trim(),
        jobTitle: job.title,
        jobLocation: job.location,
      }),
      sendEmployerNotification({
        employerEmail: employer?.email ?? null,
        employerName: employer?.name ?? 'Empleador',
        candidateName: data.candidateName.trim(),
        candidateEmail: data.candidateEmail.trim(),
        candidatePhone: data.candidatePhone?.trim() ?? null,
        jobTitle: job.title,
        message: data.message?.trim() ?? null,
      }),
    ]);

    return result;
  }
}