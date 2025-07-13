import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, ValidationPipe } from '@nestjs/common';
import { CreateCandidateDto } from './dtos/create-candidate.dto';
import { CandidateService } from './candidate.service';
import { UpdateCandidateDto } from './dtos/update-candidate-dto';
import { QueryPaginationDto } from 'src/common/dtos/query-pagination.dto';

@Controller('api/v1/candidate')
export class CandidateController {
    constructor(private readonly candidateService: CandidateService) {}

    @Get()
    @HttpCode(200)
    async GetListPagination(
        @Query() queryPagination: QueryPaginationDto
    ) {
        const { data, total } = await this.candidateService.GetListPagination(queryPagination);
        return {
            statusCode: HttpStatus.OK,
            message: 'Lấy danh sách ứng viên phân trang thành công!',
            results: data,
            meta: {
              totalItems: total,
              currentPage: queryPagination.page,
              pageSize: queryPagination.size,
              totalPages: Math.ceil(total / queryPagination.size),
            },
          };
    }

    @Get('get-list')
    @HttpCode(200)
    async GetListAll() {
        const listCandidate = await this.candidateService.GetList();
        return {
            statusCode: HttpStatus.OK,
            message: "Lấy danh sách hồ sơ ứng viên thành công!",
            results: listCandidate || [],
        }
    }

    @Post()
    @HttpCode(201)
    async CreateCandidate(@Body(new ValidationPipe()) data: CreateCandidateDto) {
        const candidate = await this.candidateService.CreateService(data);
        return {
            statusCode: HttpStatus.CREATED,
            message: "Tạo hồ sơ ứng viên thành công!",
            data: candidate || {},
        }
    }

    @Patch(':id')
    @HttpCode(200)
    async UpdatePartitionCandidate(@Param('id') id: string, @Body() data: UpdateCandidateDto) {
        const update = await this.candidateService.UpdatePartition(id, data);
        return {
            statusCode: HttpStatus.CREATED,
            message: "Cập nhật hồ sơ ứng viên thành công!",
            data: update || {},
        }
    }  

    @Delete(':id')
    @HttpCode(200)
    async DeleteCandidate(@Param('id') id: string) {
        const update = await this.candidateService.SoftDeleteService(id);
        return {
            statusCode: HttpStatus.CREATED,
            message: "Xóa hồ sơ ứng viên thành công!",
            data: update || {},
        }
    }
}
