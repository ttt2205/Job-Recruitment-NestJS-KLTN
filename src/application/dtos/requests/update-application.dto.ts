import { PartialType } from '@nestjs/mapped-types';
import { CreateApplicationDto } from './create-application.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateApplicationDto extends PartialType(CreateApplicationDto) {
  @IsNotEmpty({ message: 'Status is not empty!' })
  @IsString({ message: 'Status is not valid!' })
  status: 'PENDING' | 'REVIEWED' | 'ACCEPTED' | 'REJECTED';
}
