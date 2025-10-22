import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { CreateCandidateDto } from './dtos/create-candidate.dto';
import { CandidateService } from './candidate.service';
import { UpdateCandidateDto } from './dtos/update-candidate-dto';
import { CandidateQueryDto } from './dtos/candidate-query.dto';
import { CandidateResponseDto } from './dtos/response/candidate-response.dto';
import { IndustryResponseDto } from 'src/company/dtos/response/industry-resonse.dto';
import { UserService } from 'src/user/user.service';

@Controller('api/v1/candidate')
export class CandidateController {
  constructor(
    private readonly candidateService: CandidateService,
    private readonly userService: UserService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async GetListPagination(@Query() queryPagination: CandidateQueryDto) {
    const { data, total } =
      await this.candidateService.GetListPagination(queryPagination);
    let responseCandidateDtos: Partial<CandidateResponseDto>[] = [];
    if (data) {
      responseCandidateDtos = await Promise.all(
        data.map(async (candidate) => {
          return CandidateResponseDto.builder()
            .withId(candidate._id.toString())
            .withAvatar(candidate.avatar || '')
            .withName(candidate.name)
            .withDesignation(candidate.designation || '')
            .withLocation(candidate.location || '')
            .withHourlyRate(candidate.hourlyRate || 0)
            .withTags(candidate.skills || [])
            .withCategory(candidate.industry || '')
            .withGender(candidate.gender || '')
            .withSocialMedias(candidate.socialMedias || [])
            .withCountry(candidate.country || '')
            .withCity(candidate.city || '')
            .withStatus(candidate.status || false)
            .withCreatedAt(candidate.createdAt)
            .build();
        }),
      );
    }
    return {
      statusCode: HttpStatus.OK,
      message: 'Lấy danh sách hồ sơ ứng viên phân trang thành công!',
      results: responseCandidateDtos || [],
      meta: {
        totalItems: total,
        currentPage: queryPagination.page,
        pageSize: queryPagination.size,
        totalPages: Math.ceil(total / queryPagination.size),
      },
    };
  }

  @Get('details/:id')
  @HttpCode(HttpStatus.OK)
  async GetCandidateById(@Param('id') id: string) {
    const candidate = await this.candidateService.getCandidateById(id);
    const candidateResponseDto = CandidateResponseDto.builder()
      .withId(candidate._id.toString())
      .withUserId(candidate.userId.toString())
      .withAvatar(candidate.avatar || '')
      .withName(candidate.name)
      .withBirthday(candidate.birthday || null)
      .withDesignation(candidate.designation || '')
      .withLocation(candidate.location || '')
      .withHourlyRate(candidate.hourlyRate || 0)
      .withTags(candidate.skills || [])
      .withCategory(candidate.industry || '')
      .withExperience(candidate.experience || 0)
      .withQualification(candidate.educationLevel || '')
      .withGender(candidate.gender || '')
      .withCreatedAt(candidate.createdAt)
      .withDescription(candidate.description || '')
      .withCurrentSalary(candidate.currentSalary || '')
      .withExpectedSalary(candidate.expectedSalary || '')
      .withLanguage(candidate.language || [])
      .withSocialMedias(candidate.socialMedias || [])
      .build();
    return {
      statusCode: HttpStatus.OK,
      message: 'Lấy hồ sơ ứng viên theo id thành công!',
      data: candidateResponseDto || {},
    };
  }

  @Get('get-list')
  @HttpCode(HttpStatus.OK)
  async GetListAll() {
    const listCandidate = await this.candidateService.GetList();
    return {
      statusCode: HttpStatus.OK,
      message: 'Lấy danh sách hồ sơ ứng viên thành công!',
      results: listCandidate || [],
    };
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async UpdatePartitionCandidate(
    @Param('id') id: string,
    @Body() data: UpdateCandidateDto,
  ) {
    const update = await this.candidateService.UpdatePartition(id, data);
    return {
      success: true,
      statusCode: HttpStatus.CREATED,
      message: 'Cập nhật hồ sơ ứng viên thành công!',
      data: update || {},
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async DeleteCandidate(@Param('id') id: string) {
    const update = await this.candidateService.SoftDeleteService(id);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Xóa hồ sơ ứng viên thành công!',
      data: update || {},
    };
  }

  @Get('industry-list')
  @HttpCode(HttpStatus.OK)
  async GetListIndustryOfCandidate() {
    const listIndustry =
      await this.candidateService.GetListIndustryOfCandidate();
    return {
      statusCode: HttpStatus.OK,
      message: 'Lấy danh sách danh mục của các ứng viên thành công!',
      results: listIndustry || [],
    };
  }

  @Get('details/user/:id')
  @HttpCode(HttpStatus.OK)
  async GetCandidateByUserId(@Param('id') id: string) {
    const candidate =
      await this.candidateService.getCandidateByUserIdNullable(id);
    const user = await this.userService.findById(id);
    let candidateResponse: Partial<CandidateResponseDto> | null = null;
    if (candidate) {
      candidateResponse = CandidateResponseDto.builder()
        .withId(candidate._id.toString())
        .withEmail(user.email || '')
        .withUserId(candidate.userId.toString())
        .withAvatar(candidate.avatar || '')
        .withName(candidate.name)
        .withIndustry(candidate.industry || '')
        .withBirthday(candidate.birthday || null)
        .withDesignation(candidate.designation || '')
        .withLocation(candidate.location || '')
        .withHourlyRate(candidate.hourlyRate || 0)
        .withTags(candidate.skills || [])
        .withCategory(candidate.industry || '')
        .withExperience(candidate.experience || 0)
        .withQualification(candidate.educationLevel || '')
        .withGender(candidate.gender || '')
        .withCreatedAt(candidate.createdAt)
        .withDescription(candidate.description || '')
        .withCurrentSalary(candidate.currentSalary || '')
        .withExpectedSalary(candidate.expectedSalary || '')
        .withLanguage(candidate.language || [])
        .withSocialMedias(candidate.socialMedias || [])
        .withCountry(candidate.country || '')
        .withCity(candidate.city || '')
        .withPhone(candidate.phone || '')
        .withStatus(candidate.status || false)
        .build();
    }
    return {
      statusCode: HttpStatus.OK,
      message: 'Lấy thông tin ứng viên thành công!',
      data: candidateResponse || {},
    };
  }

  @Get('skill-list')
  @HttpCode(200)
  async GetSkillList() {
    const data = await this.candidateService.GetListByKey('skills');
    return {
      statusCode: HttpStatus.OK,
      message: 'Lấy danh sách kỹ năng thành công!',
      results: data || [],
    };
  }
}
