import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { CreateApplicationDto } from './dtos/requests/create-application.dto';
import { ApplicationService } from './application.service';
import { ApplicationResponseDto } from './dtos/response/application.response.dto';

@Controller('api/v1/application')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createApplication(
    @Body(new ValidationPipe()) createApplicationDto: CreateApplicationDto,
  ) {
    const res =
      await this.applicationService.createApplication(createApplicationDto);
    const resDto = ApplicationResponseDto.builder()
      .withId(res._id.toString())
      .withCandidateId(res.candidateId.toString())
      .withJobId(res.jobId.toString())
      .withFileName(res.fileName)
      .withCoverLetter(res?.coverLetter || '')
      .withStatus(res.status)
      .withCreatedAt(res.createdAt)
      .withUpdatedAt(res.updatedAt)
      .withDeletedAt(res.deletedAt)
      .build();

    return {
      success: true,
      statusCode: 201,
      message: 'Ứng tuyển thành công!',
      data: resDto || {},
    };
  }

  @Get('/check')
  @HttpCode(HttpStatus.OK)
  async checkApply(
    @Query('candidateId') candidateId?: string,
    @Query('jobId') jobId?: string,
  ) {
    if (!candidateId || !jobId) {
      throw new BadRequestException(
        'Thiếu candidateId hoặc jobId trong query params',
      );
    }
    const hasApplied = await this.applicationService.hasCandidateApplied(
      candidateId,
      jobId,
    );
    return {
      success: true,
      statusCode: 200,
      message: 'Kiểm tra ứng tuyển thành công!',
      data: { hasApplied },
    };
  }
}
