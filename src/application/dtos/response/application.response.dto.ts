export class ApplicationResponseDto {
  id: string;
  candidateId: string;
  jobId: string;
  fileName: string;
  coverLetter?: string;
  status: 'PENDING' | 'REVIEWED' | 'ACCEPTED' | 'REJECTED';
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;

  static builder(): ApplicationResponseDtoBuilder {
    return new ApplicationResponseDtoBuilder();
  }
}

export class ApplicationResponseDtoBuilder {
  private readonly application: ApplicationResponseDto;

  constructor() {
    this.application = new ApplicationResponseDto();
  }

  withId(id: string): this {
    this.application.id = id;
    return this;
  }

  withCandidateId(candidateId: string): this {
    this.application.candidateId = candidateId;
    return this;
  }

  withJobId(jobId: string): this {
    this.application.jobId = jobId;
    return this;
  }

  withFileName(fileName: string): this {
    this.application.fileName = fileName;
    return this;
  }

  withCoverLetter(coverLetter: string): this {
    this.application.coverLetter = coverLetter;
    return this;
  }

  withStatus(status: 'PENDING' | 'REVIEWED' | 'ACCEPTED' | 'REJECTED'): this {
    this.application.status = status;
    return this;
  }

  withCreatedAt(createdAt: Date): this {
    this.application.createdAt = createdAt;
    return this;
  }

  withUpdatedAt(updatedAt: Date): this {
    this.application.updatedAt = updatedAt;
    return this;
  }

  withDeletedAt(deletedAt: Date | null): this {
    this.application.deletedAt = deletedAt;
    return this;
  }

  build(): ApplicationResponseDto {
    return this.application;
  }
}
