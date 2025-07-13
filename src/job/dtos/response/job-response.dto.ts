import { CompanyResponseDto } from "src/company/dtos/response/company-response.dto";

export class JobResponseDto {
  id: string;
  logo: string;
  jobTitle: string;
  company: Partial<CompanyResponseDto> | null;
  location: string;
  description: string;
  responsibilities: string[];
  skillAndExperience: string[];
  time: string;
  salary: number;
  jobType: {
    styleClass: string;
    type: string;
  }[];
  link: string;
  tag: string;
  destination: {
    min: number;
    max: number;
  } | null;
  category: string;
  datePosted: string;
  expireDate: string;
  experience: string;
  totalSalary: {
    min: number;
    max: number;
  };

  static builder(): JobResponseDtoBuilder {
    return new JobResponseDtoBuilder();
  }
}

export class JobResponseDtoBuilder {
    private readonly job: JobResponseDto;

    constructor() {
        this.job = new JobResponseDto();
    }

    withId(id: string): this {
        this.job.id = id;
        return this;
    }

    withLogo(logo: string): this {
        this.job.logo = logo;
        return this;
    }

    withJobTitle(title: string): this {
        this.job.jobTitle = title;
        return this;
    }

    withCompany(company: Partial<CompanyResponseDto> | null): this {
        this.job.company = company;
        return this;
    }

    withLocation(location: string): this {
        this.job.location = location;
        return this;
    }

    withTime(time: string): this {
        this.job.time = time;
        return this;
    }

    withSalary(salary: number): this {
        this.job.salary = salary;
        return this;
    }

    withJobType(jobType: { styleClass: string; type: string }[]): this {
        this.job.jobType = jobType;
        return this;
    }

    withDestination(destination: { min: number; max: number } | null): this {
        this.job.destination = destination;
        return this;
    }

    withDatePosted(datePosted: Date) {
        this.job.datePosted = datePosted.toLocaleDateString("vi-VN");
        return this;
    }

    withExpireDate(expireDate: Date) {
        this.job.expireDate = expireDate.toLocaleDateString("vi-VN");
        return this;
    }

    withDescription(description: string) {
        this.job.description = description;
        return this;
    }

    withResponsibilities(responsibilities: string[]) {
        this.job.responsibilities = responsibilities;
        return this;
    }

    withSkillAndExperience(skillAndExperience: string[]) {
        this.job.skillAndExperience = skillAndExperience;
        return this;
    }

    build(): JobResponseDto {
        return this.job;
    }
}