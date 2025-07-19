export class CandidateEducationDto {
  id: number;
  meta: string;
  name: string;
  industry: string;
  year: string;
  text: string | null;

    static builder(): CandidateEducationDtoBuilder {
        return new CandidateEducationDtoBuilder();
    }
}

export class CandidateEducationDtoBuilder {
  private readonly education: CandidateEducationDto;

  constructor() {
    this.education = new CandidateEducationDto();
  }

  withId(id: number): this {
    this.education.id = id;
    return this;
  }

  withMeta(meta: string): this {
    this.education.meta = meta;
    return this;
  }

  withName(name: string): this {
    this.education.name = name;
    return this;
  }

  withIndustry(industry: string): this {
    this.education.industry = industry;
    return this;
  }

  withYear(year: string): this {
    this.education.year = year;
    return this;
  }

  withText(text: string | null): this {
    this.education.text = text;
    return this;
  }

  build(): CandidateEducationDto {
    return this.education;
  }
}

export class CandidateAboutResponseDto {
  title: string;
  themeColor: string;
  blockList: CandidateEducationDto[];

  static builder(): CandidateAboutResponseDtoBuilder {
    return new CandidateAboutResponseDtoBuilder();
  }
}

export class CandidateAboutResponseDtoBuilder {
  private readonly about: CandidateAboutResponseDto;

  constructor() {
    this.about = new CandidateAboutResponseDto();
  }

  withTitle(title: string): this {
    this.about.title = title;
    return this;
  }

  withThemeColor(themeColor: string): this {
    this.about.themeColor = themeColor;
    return this;
  }

  withBlockList(blockList: CandidateEducationDto[]): this {
    this.about.blockList = blockList;
    return this;
  }

  build(): CandidateAboutResponseDto {
    return this.about;
  }
}
