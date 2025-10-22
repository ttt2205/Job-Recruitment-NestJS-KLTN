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
import { ApplicationQueryDto } from './dtos/queries/application.query.dto';
import { JobResponseDto } from 'src/job/dtos/response/job-response.dto';
import { JobService } from 'src/job/job.service';
import { CompanyService } from 'src/company/company.service';
import { CompanyResponseDto } from 'src/company/dtos/response/company-response.dto';

@Controller('api/v1/application')
export class ApplicationController {
  constructor(
    private readonly applicationService: ApplicationService,
    private readonly jobService: JobService,
    private readonly companyService: CompanyService,
  ) {}

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

  @Get('get-list/dashboard/candidate/:id')
  @HttpCode(200)
  async GetApplicationsByCandidateId(
    @Param('id') id: string,
    @Query() queryPagination: ApplicationQueryDto,
  ) {
    const { data, total } =
      await this.applicationService.getPaginationByCandidateId(
        id,
        queryPagination,
      );
    const listApplicationResponseDto = await Promise.all(
      data.map(async (application) => {
        if (!application.jobId) return null;

        const job = await this.jobService.getById(application.jobId.toString());
        const company = job?.id
          ? await this.companyService.findById(job.companyId.toString())
          : null;

        const jobDto = JobResponseDto.builder()
          .withId(job._id.toString())
          .withCompany(
            company
              ? CompanyResponseDto.builder()
                  .withId(company._id.toString())
                  .withEmail(company.email)
                  .withName(company.name)
                  .build()
              : null,
          )
          .withLogo(company?.logo || '')
          .withDestination(null)
          .withJobTitle(job.name)
          .withCountry(job.country ?? '')
          .withCity(job.city ?? '')
          .withLocation(job.location)
          .withDatePosted(job.createdAt)
          .withExpireDate(job.expirationDate)
          .withStatus(job.status ?? false)
          .build();

        return ApplicationResponseDto.builder()
          .withId(application._id.toString())
          .withFileName(application.fileName)
          .withCoverLetter(application?.coverLetter || '')
          .withJob(jobDto)
          .withCreatedAt(application.createdAt)
          .withStatus(application.status)
          .build();
      }),
    );
    return {
      statusCode: HttpStatus.OK,
      message: 'Lấy danh sách đơn ứng tuyển thành công!',
      meta: {
        totalItems: total,
        currentPage: queryPagination.page,
        pageSize: queryPagination.size,
        totalPages: Math.ceil(total / queryPagination.size),
      },
      results: listApplicationResponseDto || [],
    };
  }
}
