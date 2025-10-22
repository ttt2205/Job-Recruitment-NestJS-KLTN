import { IntersectionType } from '@nestjs/mapped-types';
import { Transform, Type } from 'class-transformer';
import { IsIn, IsOptional, IsString } from 'class-validator';
import { QueryPaginationDto } from 'src/common/dtos/query-pagination.dto';

class ApplicationBaseDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  datePosted?: number;

  @IsOptional()
  @IsIn(['PENDING', 'ACCEPTED', 'REVIEWED', 'REJECTED'], {
    message: 'status must be one of PENDING, ACCEPTED, REJECTED',
  })
  @Type(() => String)
  @Transform(({ value }) =>
    value === '' ? undefined : String(value).toUpperCase(),
  )
  status?: string;
}

export class ApplicationQueryDto extends IntersectionType(
  QueryPaginationDto,
  ApplicationBaseDto,
) {}
