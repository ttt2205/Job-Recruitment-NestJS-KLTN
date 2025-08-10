export class CompanyResponseDto {
  id: string;
  email: string;
  name: string;
  userId: string;
  primaryIndustry?: string;
  size?: string;
  foundedIn?: number;
  description?: string;
  phone: string;
  country?: string;
  city?: string;
  address?: string;
  logo?: string;
  website?: string;
  jobNumber?: number; // Optional field for job count
  status?: boolean;

  socialMedias?: {
    platform: string;
    url: string;
  }[];

  createdBy?: {
    userId: number;
    email: string;
  };

  updatedBy?: {
    userId: number;
    email: string;
  };

  deletedBy?: {
    userId: number;
    email: string;
  };

  isDeleted: boolean;

  createdAt: Date;

  updatedAt: Date;

  static builder(): CompanyResponseDtoBuilder {
      return new CompanyResponseDtoBuilder();
    }
}

export class CompanyResponseDtoBuilder {
  private company: Partial<CompanyResponseDto> = {};

  static builder(): CompanyResponseDto {
    return new CompanyResponseDto();
  }

  withId(id: string): this {
    this.company.id = id;
    return this;
  }

  withEmail(email: string): this {
    this.company.email = email;
    return this;
  }

  withName(name: string): this {
    this.company.name = name;
    return this;
  }

  withUserId(userId: string): this {
    this.company.userId = userId;
    return this;
  }

  withPrimaryIndustry(industry?: string): this {
    this.company.primaryIndustry = industry;
    return this;
  }

  withSize(size?: string): this {
    this.company.size = size;
    return this;
  }

  withFoundedIn(foundedIn?: number): this {
    this.company.foundedIn = foundedIn;
    return this;
  }

  withDescription(description?: string): this {
    this.company.description = description;
    return this;
  }

  withPhone(phone: string): this {
    this.company.phone = phone;
    return this;
  }

  withCountry(country: string): this {
    this.company.country = country;
    return this;
  }

  withCity(city: string): this {
    this.company.city = city;
    return this;
  }

  withAddress(address: string): this {
    this.company.address = address;
    return this;
  }

  withLogo(logo?: string): this {
    this.company.logo = logo;
    return this;
  }

  withWebsite(website?: string): this {
    this.company.website = website;
    return this;
  }

  withStatus(status?: boolean): this {
    this.company.status = status;
    return this;
  }

  withSocialMedias(socialMedias?: { platform: string; url: string }[]): this {
    this.company.socialMedias = socialMedias;
    return this;
  }

  withCreatedBy(createdBy?: { userId: number; email: string }): this {
    this.company.createdBy = createdBy;
    return this;
  }

  withUpdatedBy(updatedBy?: { userId: number; email: string }): this {
    this.company.updatedBy = updatedBy;
    return this;
  }

  withDeletedBy(deletedBy?: { userId: number; email: string }): this {
    this.company.deletedBy = deletedBy;
    return this;
  }

  withIsDeleted(isDeleted: boolean): this {
    this.company.isDeleted = isDeleted;
    return this;
  }

  withCreatedAt(date: Date): this {
    this.company.createdAt = date;
    return this;
  }

  withUpdatedAt(date: Date): this {
    this.company.updatedAt = date;
    return this;
  }

  withJobNumber(jobNumber?: number): this {
    this.company.jobNumber = jobNumber;
    return this;
  }

  build(): Partial<CompanyResponseDto> {
    return this.company;
  }
}
