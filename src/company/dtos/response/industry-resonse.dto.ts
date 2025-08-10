export class IndustryResponseDto {
  label: string;

  value: string;

  static builder(): IndustryResponseDtoBuilder {
      return new IndustryResponseDtoBuilder();
    }
}

export class IndustryResponseDtoBuilder {
  private industries: Partial<IndustryResponseDto> = {};

  static builder(): IndustryResponseDto {
    return new IndustryResponseDto();
  }

  withLabel(label: string): this {
    this.industries.label = label;
    return this;
  }

  withValue(value: string): this {
    this.industries.value = value;
    return this;
  }
  

  build(): Partial<IndustryResponseDto> {
    return this.industries;
  }
}
