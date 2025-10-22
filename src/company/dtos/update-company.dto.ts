import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateCompanyDto } from './create-company.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateCompanyDto extends PartialType(
  OmitType(CreateCompanyDto, ['userId'] as const),
) {
  @IsOptional()
  @IsBoolean()
  status?: boolean;
}
