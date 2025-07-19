import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Inject, Param, Patch, Post, Query, ValidationPipe } from '@nestjs/common';
import { CandidateAboutService } from './candidate-about.service';
import { CreateCandidateAboutDto } from './dtos/create-candidate-about.dto';
import { UpdateCandidateAboutDto } from './dtos/update-candidate-about.dto';
import { QueryPaginationDto } from 'src/common/dtos/query-pagination.dto';
import { CandidateAboutResponseDto, CandidateEducationDto } from './dtos/response/candidate-about-response.dto';


@Controller('api/v1/candidate-about')
export class CandidateAboutController {
    constructor(private readonly candidateAboutService: CandidateAboutService) {}

    @Get()
    @HttpCode(200)
    async GetListPagination(
        @Query() queryPagination: QueryPaginationDto
    ) {
        const { data, total } = await this.candidateAboutService.getListPagination(queryPagination);
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
        const listCandidate = await this.candidateAboutService.getList();
        return {
            statusCode: HttpStatus.OK,
            message: "Lấy danh sách hồ sơ thông tin ứng viên thành công!",
            results: listCandidate || [],
        }
    }

    @Post()
    @HttpCode(201)
    async CreateCandidate(@Body(new ValidationPipe()) data: CreateCandidateAboutDto) {
        const candidate = await this.candidateAboutService.createService(data);
        return {
            statusCode: HttpStatus.CREATED,
            message: "Tạo hồ sơ thông tin ứng viên thành công!",
            data: candidate || {},
        }
    }

    @Patch(':id')
    @HttpCode(200)
    async UpdatePartitionCandidate(@Param('id') id: string, @Body() data: UpdateCandidateAboutDto) {
        const update = await this.candidateAboutService.updatePartition(id, data);
        return {
            statusCode: HttpStatus.CREATED,
            message: "Cập nhật hồ sơ thông tin ứng viên thành công!",
            data: update || {},
        }
    }  

    @Delete(':id')
    @HttpCode(200)
    async DeleteCandidate(@Param('id') id: string) {
        const update = await this.candidateAboutService.softDeleteService(id);
        return {
            statusCode: HttpStatus.CREATED,
            message: "Xóa hồ sơ thông tin ứng viên thành công!",
            data: update || {},
        }
    }

    @Get('details/user/:userId')
    @HttpCode(HttpStatus.OK)
    async GetCandidateAboutByUserId(@Param('userId') id: string) {
        const candidateAbout = await this.candidateAboutService.getByUserId(id);
        // Combine candidateAbout with CandidateAboutResponseDto
        let education: CandidateAboutResponseDto = CandidateAboutResponseDto.builder()
            .withTitle('Education')
            .withThemeColor("")
            .withBlockList([])
            .build();
        let workAndExperience: CandidateAboutResponseDto = CandidateAboutResponseDto.builder()
            .withTitle('Work & Experience')
            .withThemeColor("theme-blue")
            .withBlockList([])
            .build();
        let award: CandidateAboutResponseDto = CandidateAboutResponseDto.builder()
            .withTitle('Awards')
            .withThemeColor("theme-yellow")
            .withBlockList([])
            .build();

        if (candidateAbout) {
            candidateAbout.map(item => {
                switch (item.title) {
                    case 'Education': {
                        let blockList: CandidateEducationDto = CandidateEducationDto.builder()
                            .withMeta(item.industry.charAt(0).toUpperCase())
                            .withIndustry(item.industry)
                            .withYear(item.time)
                            .withText(item?.text || "")
                            .build();
                        education.blockList.push(blockList);
                        break;
                    }
                    case 'Work & Experience': {
                        let blockList: CandidateEducationDto = CandidateEducationDto.builder()
                            .withMeta(item.industry.charAt(0).toUpperCase())
                            .withIndustry(item.industry)
                            .withYear(item.time)
                            .withText(item?.text || "")
                            .build();
                        workAndExperience.blockList.push(blockList);
                        break;
                    }
                    case 'Awards': {
                        let blockList: CandidateEducationDto = CandidateEducationDto.builder()
                            .withMeta(item.industry.charAt(0).toUpperCase())
                            .withIndustry(item.industry)
                            .withYear(item.time)
                            .withText(item?.text || "")
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
            message: "Lấy danh mục chứng chỉ của ứng viên theo id thành công!",
            results: response || [],
        }
    }
}
