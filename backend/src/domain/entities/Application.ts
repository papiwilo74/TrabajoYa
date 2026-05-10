export enum ApplicationStatus {
  PENDING = 'pending',
  REVIEWED = 'reviewed',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected'
}

export class Application {
  constructor(
    public readonly id: string,
    public readonly jobId: string,
    public readonly candidateId: string,
    public readonly status: ApplicationStatus,
    public readonly appliedAt: Date
  ) {}
}