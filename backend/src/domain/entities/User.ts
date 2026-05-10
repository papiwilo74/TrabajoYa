export enum UserRole {
  CANDIDATE = 'candidate',
  EMPLOYER = 'employer',
}

export class User {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly role: UserRole,
    // Agregamos la contraseña ya que los requerimientos indican que luego debe ir encriptada
    public readonly passwordHash: string 
  ) {}
}