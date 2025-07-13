import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Inject, Param, Patch, Post, Query, ValidationPipe } from '@nestjs/common';
import { CandidateAboutService } from './candidate-about.service';
import { CreateCandidateAboutDto } from './dtos/create-candidate-about.dto';
import { UpdateCandidateAboutDto } from './dtos/update-candidate-about.dto';
import { QueryPaginationDto } from 'src/common/dtos/query-pagination.dto';


@Controller('api/v1/candidate-about')
export class CandidateAboutController {
    constructor(private readonly candidateAboutService: CandidateAboutService) {}

    @Get()
    @HttpCode(200)
    async GetListPagination(
        @Query() queryPagination: QueryPaginationDto
    ) {
        const { data, total } = await this.candidateAboutService.GetListPagination(queryPagination);
        return {
            statusCode: HttpStatus.OK,
            message: 'Lấy danh sách thông tin ứng viên phân trang thành công!',
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
        const listCandidate = await this.candidateAboutService.GetList();
        return {
            statusCode: HttpStatus.OK,
            message: "Lấy danh sách hồ sơ thông tin ứng viên thành công!",
            results: listCandidate || [],
        }
    }

    @Post()
    @HttpCode(201)
    async CreateCandidate(@Body(new ValidationPipe()) data: CreateCandidateAboutDto) {
        const candidate = await this.candidateAboutService.CreateService(data);
        return {
            statusCode: HttpStatus.CREATED,
            message: "Tạo hồ sơ thông tin ứng viên thành công!",
            data: candidate || {},
        }
    }

    @Patch(':id')
    @HttpCode(200)
    async UpdatePartitionCandidate(@Param('id') id: string, @Body() data: UpdateCandidateAboutDto) {
        const update = await this.candidateAboutService.UpdatePartition(id, data);
        return {
            statusCode: HttpStatus.CREATED,
            message: "Cập nhật hồ sơ thông tin ứng viên thành công!",
            data: update || {},
        }
    }  

    @Delete(':id')
    @HttpCode(200)
    async DeleteCandidate(@Param('id') id: string) {
        const update = await this.candidateAboutService.SoftDeleteService(id);
        return {
            statusCode: HttpStatus.CREATED,
            message: "Xóa hồ sơ thông tin ứng viên thành công!",
            data: update || {},
        }
    }
}
