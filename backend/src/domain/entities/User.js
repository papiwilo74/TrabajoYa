// backend/src/domain/entities/User.js

export class User {
  constructor(id, name, email, passwordHash, role) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.passwordHash = passwordHash;
    this.role = role; // Puede ser 'candidate' o 'employer'
    this.createdAt = new Date();
  }

  // Verificamos si el usuario es un empleador
  isEmployer() {
    return this.role === 'employer';
  }
}