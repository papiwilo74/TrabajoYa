// backend/src/domain/entities/Job.js

export const JobType = {
  FORMAL: 'formal',
  INFORMAL: 'informal',
};

export class Job {
  constructor(id, employerId, title, description, type, category, location, salary, createdAt) {
    this.id = id;
    this.employerId = employerId;
    this.title = title;
    this.description = description;
    this.type = type; // 'formal' | 'informal'
    this.category = category; // ej. 'tecnología', 'ventas', 'construcción'
    this.location = location; // ej. 'Barranquilla'
    this.salary = salary ?? null; // null = "a convenir"
    this.status = 'open'; // 'open' | 'closed'
    this.createdAt = createdAt ?? new Date();
  }

  closeJob() {
    this.status = 'closed';
  }
}