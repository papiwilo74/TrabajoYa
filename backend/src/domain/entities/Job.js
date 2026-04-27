// backend/src/domain/entities/Job.js

export class Job {
  constructor(id, employerId, title, description, type, location, salary) {
    this.id = id;
    this.employerId = employerId; 
    this.title = title;
    this.description = description;
    this.type = type; // Puede ser 'formal' o 'informal'
    this.location = location;
    this.salary = salary; // null si el pago es "a convenir"
    this.status = 'open'; // 'open' o 'closed'
    this.createdAt = new Date();
  }

  // Cerramos la vacante para no recibir más candidatos
  closeJob() {
    this.status = 'closed';
  }
}