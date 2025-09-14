export class CandidateResponseDto {
  id: string;
  userId: string;
  email: string;
  avatar: string;
  name: string;
  industry: string;
  designation: string;
  country: string;
  city: string;
  location: string;
  hourlyRate: number;
  tags: string[]; // === skills
  category: string;
  gender: string;
  createdAt: string;
  experience: number;
  qualification: string; // == educationLevel
  birthday: Date | null;
  phone?: string;
  age: number;
  currentSalary?: string;
  expectSalary?: string;
  description?: string;
  language?: string[];
  socialMedias?: {
    platform: string;
    url: string;
  }[];
  status?: boolean;

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

  withIndustry(industry: string): this {
    this.candidate.industry = industry;
    return this;
  }

  withPhone(phone: string): this {
    this.candidate.phone = phone;
    return this;
  }

  withUserId(userId: string): this {
    this.candidate.userId = userId;
    return this;
  }

  withEmail(email: string): this {
    this.candidate.email = email;
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
  
  withBirthday(birthday: Date | null): this {
    this.candidate.birthday = birthday;
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

  withCreatedAt(createdAt: Date): this {
    this.candidate.createdAt = createdAt.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
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

  withAge(age: Date | null): this {
    this.candidate.age = age ? new Date().getFullYear() - age.getFullYear() : 0;
    return this;
  }

  withCurrentSalary(currentSalary: string): this {
    this.candidate.currentSalary = currentSalary;
    return this;
  }

  withExpectSalary(expectSalary: string): this {
    this.candidate.expectSalary = expectSalary;
    return this;
  }

  withDescription(description: string): this {
    this.candidate.description = description;
    return this;
  }

  withLanguage(language: string[]): this {
    this.candidate.language = language;
    return this;
  }

  withSocialMedias(socialMedias?: { platform: string; url: string }[]): this {
    this.candidate.socialMedias = socialMedias;
    return this;
  }

  withCountry(country: string): this {
    this.candidate.country = country;
    return this;
  }

  withCity(city: string): this {
    this.candidate.city = city;
    return this;
  }

  withStatus(status: boolean): this {
    this.candidate.status = status;
    return this;
  }

  build(): CandidateResponseDto {
    return this.candidate;
  }
}
