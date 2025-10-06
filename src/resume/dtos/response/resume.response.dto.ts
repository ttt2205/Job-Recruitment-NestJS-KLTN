import { CompanyResponseDto } from "src/company/dtos/response/company-response.dto"; 

export class ResumeResponseDto {
  id: string;
  candidateId: string;
  fileName: string | null;

  static builder(): ResumeResponseDtoBuilder {
    return new ResumeResponseDtoBuilder();
  }
}

export class ResumeResponseDtoBuilder {
    private readonly resume: ResumeResponseDto;

    constructor() {
        this.resume = new ResumeResponseDto();
    }

    withId(id: string): this {
        this.resume.id = id;
        return this;
    }

    withCandidateId(candidateId: string): this {
        this.resume.candidateId = candidateId;
        return this;
    }

    withFileName(fileName: string | null): this {
        this.resume.fileName = fileName;
        return this;
    }

    build(): ResumeResponseDto {
        return this.resume;
    }
}