import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateApplicationDto {
  @IsNotEmpty({
    message: 'Candidate ID is not empty!',
  })
  candidateId: string;

  @IsNotEmpty({ message: 'Job ID is not empty!' })
  jobId: string;

  @IsNotEmpty({ message: 'Resume ID is not empty!' })
  resumeId: string;

  @IsOptional()
  @Type(() => String)
  coverLetter?: string;
}
