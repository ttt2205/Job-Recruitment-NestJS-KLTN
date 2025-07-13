import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, ValidationPipe } from '@nestjs/common';
import { JobService } from './job.service';
import { QueryPaginationDto } from 'src/common/dtos/query-pagination.dto';
import { CreateJobDto } from './dtos/create-job.dto';
import { UpdateJobDto } from './dtos/update-job.dto';
import { JobQueryDto } from './dtos/job-query.dto';
import { JobResponseDto } from './dtos/response/job-response.dto';
import { CompanyService } from 'src/company/company.service';
import { Company } from 'src/company/company.schema';

@Controller('api/v1/job')
export class JobController {
    constructor(
        private readonly jobService: JobService,
        private readonly companyService: CompanyService
    ) {}

    @Get()
    @HttpCode(200)
    async GetListPagination(
        @Query() queryPagination: JobQueryDto
    ) {
        const { data, total } = await this.jobService.GetListPagination(queryPagination);
        const listJobResponseDto = await Promise.all(
            data.map(async (job) => {
                let company: Company | null = null;
                if (job.companyId) {
                    company = await this.companyService.findById(job.companyId.toString());
                }
                return JobResponseDto.builder()
                    .withId(job._id.toString())
                    .withCompany(company?.name || "")
                    .withDestination(null)
                    .withJobTitle(job.name)
                    .withJobType(job?.jobType || [])
                    .withLocation(job.location)
                    .withLogo("")
                    .withSalary(job.salary || 0)
                    .withTime(job.hours)
                    .build();
            })
          );
        return {
            statusCode: HttpStatus.OK,
            message: 'Lấy danh sách công việc phân trang thành công!',
            results: listJobResponseDto,
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
        const listJob = await this.jobService.GetList();
        const listJobResponseDto = await Promise.all(
            listJob.map(async (job) => {
                let company: Company | null = null;
                if (job.companyId) {
                    company = await this.companyService.findById(job.companyId.toString());
                }
                return JobResponseDto.builder()
                    .withId(job._id.toString())
                    .withCompany(company?.name || "")
                    .withDestination(null)
                    .withJobTitle(job.name)
                    .withJobType(job?.jobType || [])
                    .withLocation(job.location)
                    .withLogo("")
                    .withSalary(job.salary || 0)
                    .withTime(job.hours)
                    .build();
            })
          );
        return {
            statusCode: HttpStatus.OK,
            message: "Lấy danh sách công việc thành công!",
            results: listJobResponseDto || [],
        }
    }

    @Post()
    @HttpCode(201)
    async CreateJob(@Body(new ValidationPipe()) data: CreateJobDto) {
        console.log("CreateJobDto: ", data)
        const company = await this.jobService.CreateService(data);
        return {
            statusCode: HttpStatus.CREATED,
            message: "Tạo công việc thành công!",
            data: company || {},
        }
    }

    @Patch(':id')
    @HttpCode(200)
    async UpdatePartitionJob(@Param('id') id: string, @Body() data: UpdateJobDto) {
        const update = await this.jobService.UpdatePartition(id, data);
        return {
            statusCode: HttpStatus.CREATED,
            message: "Cập nhật công việc thành công!",
            data: update || {},
        }
    }  

    @Delete(':id')
    @HttpCode(200)
    async DeleteJob(@Param('id') id: string) {
        const update = await this.jobService.SoftDeleteService(id);
        return {
            statusCode: HttpStatus.CREATED,
            message: "Xóa công việc thành công!",
            data: update || {},
        }
    }

    // Category == Industry
    @Get('category-list')
    @HttpCode(200)
    async GetCategoryList() {
        const data = await this.jobService.GetListCategory();
        return {
            statusCode: HttpStatus.CREATED,
            message: "Lấy danh sách danh mục thành công!",
            data: data || {},
        }
    }

    // MaxSalary
    @Get('max-salary')
    @HttpCode(200)
    async GetMaxSalary() {
        const data = await this.jobService.GetMaxSalary();
        return {
            statusCode: HttpStatus.CREATED,
            message: "Lấy mức lương cao nhất thành công!",
            data: data || {},
        }
    }
}
