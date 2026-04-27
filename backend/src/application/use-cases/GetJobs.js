// backend/src/application/use-cases/GetJobs.js

export class GetJobs {
  constructor(jobRepository) {
    this.jobRepository = jobRepository;
  }

  // Ejecutamos la acción de buscar todos los empleos
  execute() {
    // Aquí podríamos agregar lógica para filtrar (ej. mostrar solo los "abiertos")
    return this.jobRepository.findAll();
  }
}