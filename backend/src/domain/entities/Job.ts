export enum JobType {
  FORMAL = 'formal',
  INFORMAL = 'informal',
}

export class Job {
  constructor(
    public readonly id: string,
    public readonly employerId: string,
    public readonly title: string,
    public readonly description: string,
    public readonly type: JobType,
    public readonly category: string,
    public readonly location: string, // Por defecto manejaremos "Barranquilla"
    public readonly createdAt: Date
  ) {}
}