import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { CandidateAboutService } from './candidate-about.service';
import { CreateCandidateAboutDto } from './dtos/create-candidate-about.dto';
import { UpdateCandidateAboutDto } from './dtos/update-candidate-about.dto';
import { QueryPaginationDto } from 'src/common/dtos/query-pagination.dto';
import {
  CandidateAboutResponseDto,
  CandidateSectionDto,
} from './dtos/response/candidate-about-response.dto';

@Controller('api/v1/candidate-about')
export class CandidateAboutController {
  constructor(private readonly candidateAboutService: CandidateAboutService) {}

  @Post()
  @HttpCode(201)
  async CreateCandidateSection(
    @Body(new ValidationPipe()) data: CreateCandidateAboutDto,
  ) {
    const section = await this.candidateAboutService.createService(data);
    const sectionDto = CandidateSectionDto.builder()
      .withId(section._id.toString())
      .withMeta(section.title.charAt(0).toUpperCase())
      .withTitle(section.title)
      .withOrganization(section.organization)
      .withTime(
        this.candidateAboutService.formatTime(
          section.startTime,
          section.endTime,
        ),
      )
      .withText(section?.text || '')
      .build();
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Tạo hồ sơ thông tin ứng viên thành công!',
      data: sectionDto || {},
    };
  }

  @Patch(':id')
  @HttpCode(200)
  async UpdatePartitionCandidate(
    @Param('id') id: string,
    @Body() data: UpdateCandidateAboutDto,
  ) {
    const section = await this.candidateAboutService.updatePartition(id, data);
    const sectionDto = CandidateSectionDto.builder()
      .withId(section._id.toString())
      .withMeta(section.title.charAt(0).toUpperCase())
      .withTitle(section.title)
      .withOrganization(section.organization)
      .withTime(
        this.candidateAboutService.formatTime(
          section.startTime,
          section.endTime,
        ),
      )
      .withText(section?.text || '')
      .build();
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Cập nhật hồ sơ thông tin ứng viên thành công!',
      data: sectionDto || {},
    };
  }

  @Delete(':id')
  @HttpCode(200)
  async DeleteCandidate(@Param('id') id: string) {
    const deleted = await this.candidateAboutService.deleteById(id);
    return {
      success: true,
      statusCode: HttpStatus.CREATED,
      message: 'Xóa hồ sơ thông tin ứng viên thành công!',
      data: deleted || {},
    };
  }

  @Get('details/candidate/:id')
  @HttpCode(HttpStatus.OK)
  async GetCandidateAboutByUserId(@Param('id') id: string) {
    const candidateAbout =
      await this.candidateAboutService.getByCandidateId(id);
    // Combine candidateAbout with CandidateAboutResponseDto
    let education: CandidateAboutResponseDto =
      CandidateAboutResponseDto.builder()
        .withCategory('Educations')
        .withThemeColor('')
        .withBlockList([])
        .build();
    let workAndExperience: CandidateAboutResponseDto =
      CandidateAboutResponseDto.builder()
        .withCategory('Works & Experiences')
        .withThemeColor('theme-blue')
        .withBlockList([])
        .build();
    let award: CandidateAboutResponseDto = CandidateAboutResponseDto.builder()
      .withCategory('Awards')
      .withThemeColor('theme-yellow')
      .withBlockList([])
      .build();

    if (candidateAbout) {
      candidateAbout.map((item) => {
        switch (item.category) {
          case 'Education': {
            let blockList: CandidateSectionDto = CandidateSectionDto.builder()
              .withId(item._id.toString())
              .withMeta(item.title.charAt(0).toUpperCase())
              .withTitle(item.title)
              .withOrganization(item.organization)
              .withTime(
                this.candidateAboutService.formatTime(
                  item.startTime,
                  item.endTime,
                ),
              )
              .withText(item?.text || '')
              .build();
            education.blockList.push(blockList);
            break;
          }
          case 'Work & Experience': {
            let blockList: CandidateSectionDto = CandidateSectionDto.builder()
              .withId(item._id.toString())
              .withMeta(item.title.charAt(0).toUpperCase())
              .withTitle(item.title)
              .withOrganization(item.organization)
              .withTime(
                this.candidateAboutService.formatTime(
                  item.startTime,
                  item.endTime,
                ),
              )
              .withText(item?.text || '')
              .build();
            workAndExperience.blockList.push(blockList);
            break;
          }
          case 'Award': {
            let blockList: CandidateSectionDto = CandidateSectionDto.builder()
              .withId(item._id.toString())
              .withMeta(item.title.charAt(0).toUpperCase())
              .withTitle(item.title)
              .withOrganization(item.organization)
              .withTime(
                this.candidateAboutService.formatTime(
                  item.startTime,
                  item.endTime,
                ),
              )
              .withText(item?.text || '')
              .build();
            award.blockList.push(blockList);
            break;
          }
          default:
            break;
        }
      });
    }
    // Combine all sections into a response array
    const response: CandidateAboutResponseDto[] = [];
    if (education.blockList.length > 0) {
      response.push(education);
    }
    if (workAndExperience.blockList.length > 0) {
      response.push(workAndExperience);
    }
    if (award.blockList.length > 0) {
      response.push(award);
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'Lấy danh mục chứng chỉ của ứng viên theo id thành công!',
      results: response || [],
    };
  }
}
