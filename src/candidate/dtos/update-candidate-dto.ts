import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateCandidateDto } from './create-candidate.dto';
import { IsBoolean, IsOptional } from 'class-validator';

/**
 * OmitType() sẽ loại bỏ hoàn toàn trường userId khỏi UpdateCandidateDto.
 * → Nghĩa là nếu client gửi userId trong request, NestJS sẽ bỏ qua (hoặc có thể kiểm soát thêm trong validation pipe để báo lỗi).
 */
export class UpdateCandidateDto extends PartialType(
  OmitType(CreateCandidateDto, ['userId'] as const),
) {
  @IsOptional()
  @IsBoolean()
  status?: boolean;
}
