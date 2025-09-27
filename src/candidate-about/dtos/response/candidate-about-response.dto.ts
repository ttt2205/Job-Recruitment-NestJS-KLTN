export class CandidateSectionDto {
  id: string;
  meta: string;
  title: string;
  organization: string;
  time: string;
  text: string | null;

    static builder(): CandidateSectionDtoBuilder {
        return new CandidateSectionDtoBuilder();
    }
}

export class CandidateSectionDtoBuilder {
  private readonly section: CandidateSectionDto;

  constructor() {
    this.section = new CandidateSectionDto();
  }

  withId(id: string): this {
    this.section.id = id;
    return this;
  }

  withMeta(meta: string): this {
    this.section.meta = meta;
    return this;
  }

  withOrganization(organization: string): this {
    this.section.organization = organization;
    return this;
  }

  withTitle(title: string): this {
    this.section.title = title;
    return this;
  }

  withTime(time: string): this {
    this.section.time = time;
    return this;
  }

  withText(text: string | null): this {
    this.section.text = text;
    return this;
  }

  build(): CandidateSectionDto {
    return this.section;
  }
}

export class CandidateAboutResponseDto {
  category: string;
  themeColor: string;
  blockList: CandidateSectionDto[];

  static builder(): CandidateAboutResponseDtoBuilder {
    return new CandidateAboutResponseDtoBuilder();
  }
}

export class CandidateAboutResponseDtoBuilder {
  private readonly about: CandidateAboutResponseDto;

  constructor() {
    this.about = new CandidateAboutResponseDto();
  }

  withCategory(category: string): this {
    this.about.category = category;
    return this;
  }

  withThemeColor(themeColor: string): this {
    this.about.themeColor = themeColor;
    return this;
  }

  withBlockList(blockList: CandidateSectionDto[]): this {
    this.about.blockList = blockList;
    return this;
  }

  build(): CandidateAboutResponseDto {
    return this.about;
  }
}
