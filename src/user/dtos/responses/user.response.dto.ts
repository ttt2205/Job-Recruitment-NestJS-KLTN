export class UserResponseDto {
  id: string;
  email: string;
  type: string;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
  static builder(): UserResponseDtoBuilder {
    return new UserResponseDtoBuilder();
  }
}

export class UserResponseDtoBuilder {
  private readonly user: UserResponseDto;
  constructor() {
    this.user = new UserResponseDto();
  }

  withId(id: string): this {
    this.user.id = id;
    return this;
  }
  withEmail(email: string): this {
    this.user.email = email;
    return this;
  }
  withType(type: string): this {
    this.user.type = type;
    return this;
  }
  withStatus(status: boolean): this {
    this.user.status = status;
    return this;
  }
  withCreatedAt(createdAt: Date): this {
    this.user.createdAt = createdAt;
    return this;
  }
  withUpdatedAt(updatedAt: Date): this {
    this.user.updatedAt = updatedAt;
    return this;
  }
  build(): UserResponseDto {
    return this.user;
  }
}
