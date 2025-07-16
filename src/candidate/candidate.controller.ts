import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, ValidationPipe } from '@nestjs/common';
import { CreateCandidateDto } from './dtos/create-candidate.dto';
import { CandidateService } from './candidate.service';
import { UpdateCandidateDto } from './dtos/update-candidate-dto';
import { CandidateQueryDto } from './dtos/candidate-query.dto';
import { CandidateResponseDto } from './dtos/response/candidate-response.dto';

@Controller('api/v1/candidate')
export class CandidateController {
    constructor(private readonly candidateService: CandidateService) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    async GetListPagination(
        @Query() queryPagination: CandidateQueryDto
    ) {
        const { data, total } = await this.candidateService.GetListPagination(queryPagination);
        let responseCandidateDtos: Partial<CandidateResponseDto>[] = [];
        if (data) {
            responseCandidateDtos = await Promise.all(data.map(async (candidate) => {
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
                .build();
        }));
        }
        return {
            statusCode: HttpStatus.OK,
            message: 'Lấy danh sách ứng viên phân trang thành công!',
            results: responseCandidateDtos || [],
            meta: {
              totalItems: total,
              currentPage: queryPagination.page,
              pageSize: queryPagination.size,
              totalPages: Math.ceil(total / queryPagination.size),  
            },
          };
    }

    @Get('get-list')
    @HttpCode(HttpStatus.OK)
    async GetListAll() {
        const listCandidate = await this.candidateService.GetList();
        return {
            statusCode: HttpStatus.OK,
            message: "Lấy danh sách hồ sơ ứng viên thành công!",
            results: listCandidate || [],
        }
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async CreateCandidate(@Body(new ValidationPipe()) data: CreateCandidateDto) {
        const candidate = await this.candidateService.CreateService(data);
        return {
            statusCode: HttpStatus.CREATED,
            message: "Tạo hồ sơ ứng viên thành công!",
            data: candidate || {},
        }
    }

    @Patch(':id')
    @HttpCode(HttpStatus.OK)
    async UpdatePartitionCandidate(@Param('id') id: string, @Body() data: UpdateCandidateDto) {
        const update = await this.candidateService.UpdatePartition(id, data);
        return {
            statusCode: HttpStatus.CREATED,
            message: "Cập nhật hồ sơ ứng viên thành công!",
            data: update || {},
        }
    }  

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    async DeleteCandidate(@Param('id') id: string) {
        const update = await this.candidateService.SoftDeleteService(id);
        return {
            statusCode: HttpStatus.CREATED,
            message: "Xóa hồ sơ ứng viên thành công!",
            data: update || {},
        }
    }

    @Get('industry-list')
    @HttpCode(HttpStatus.OK)
    async GetListIndustryOfCandidate() {
        const listIndustry = await this.candidateService.GetListIndustryOfCandidate();
        return {
            statusCode: HttpStatus.OK,
            message: "Lấy danh sách danh mục của các ứng viên thành công!",
            results: listIndustry || [],
        }
    }
}
