export class CandidateResponseDto {
  id: string;
  avatar: string;
  name: string;
  designation: string;
  location: string;
  hourlyRate: number;
  tags: string[];
  category: string;
  gender: string;
  createdAt: string;
  experience: number;
  qualification: string;

  static builder(): CandidateResponseDtoBuilder {
    return new CandidateResponseDtoBuilder();
  }
}

export class CandidateResponseDtoBuilder {
  private readonly candidate: CandidateResponseDto;

  constructor() {
    this.candidate = new CandidateResponseDto();
  }

  withId(id: string): this {
    this.candidate.id = id;
    return this;
  }

  withAvatar(avatar: string): this {
    this.candidate.avatar = avatar;
    return this;
  }

  withName(name: string): this {
    this.candidate.name = name;
    return this;
  }

  withDesignation(designation: string): this {
    this.candidate.designation = designation;
    return this;
  }

  withLocation(location: string): this {
    this.candidate.location = location;
    return this;
  }

  withHourlyRate(rate: number): this {
    this.candidate.hourlyRate = rate;
    return this;
  }

  withTags(tags: string[]): this {
    this.candidate.tags = tags;
    return this;
  }

  withCategory(category: string): this {
    this.candidate.category = category;
    return this;
  }

  withGender(gender: string): this {
    this.candidate.gender = gender;
    return this;
  }

  withCreatedAt(createdAt: string): this {
    this.candidate.createdAt = createdAt;
    return this;
  }

  withExperience(experience: number): this {
    this.candidate.experience = experience;
    return this;
  }

  withQualification(qualification: string): this {
    this.candidate.qualification = qualification;
    return this;
  }

  build(): CandidateResponseDto {
    return this.candidate;
  }
}
