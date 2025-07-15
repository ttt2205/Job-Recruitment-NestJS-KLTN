import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, ValidationPipe } from '@nestjs/common';
import { JobService } from './job.service';
import { QueryPaginationDto } from 'src/common/dtos/query-pagination.dto';
import { CreateJobDto } from './dtos/create-job.dto';
import { UpdateJobDto } from './dtos/update-job.dto';
import { JobQueryDto } from './dtos/job-query.dto';
import { CompanyService } from 'src/company/company.service';
import { Company } from 'src/company/company.schema';
import { JobResponseDto } from './dtos/response/job-response.dto';
import { CompanyResponseDto } from 'src/company/dtos/response/company-response.dto';
import { count } from 'console';

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
        let listJobResponseDto: JobResponseDto[] = [];
        if (data) {
            listJobResponseDto = await Promise.all(
            data.map(async (job) => {
                let companyDto: Partial<CompanyResponseDto> | null = null;
                if (job.companyId) {
                    let company = await this.companyService.findById(job.companyId.toString());
                    companyDto = CompanyResponseDto.builder()
                        .withId(company._id.toString())
                        .withEmail(company.email)
                        .withName(company.name)
                        .withUserId(company.userId.toString())
                        .withPrimaryIndustry(company.primaryIndustry)
                        .withSize(company.size)
                        .withFoundedIn(company.foundedIn)
                        .withDescription(company.description)
                        .withPhone(company.phone)
                        .withAddress(company.address)
                        .withLogo(company.logo)
                        .withSocialMedias(company.socialMedias)
                        .withCreatedBy(company.createdBy)
                        .withUpdatedBy(company.updatedBy)
                        .withDeletedBy(company.deletedBy)
                        .withIsDeleted(company.isDeleted)
                        .withCreatedAt(company.createdAt)
                        .withUpdatedAt(company.updatedAt)
                        .build();
                }

                return JobResponseDto.builder()
                    .withId(job._id.toString())
                    .withCompany(companyDto)
                    .withDestination(null)
                    .withJobTitle(job.name)
                    .withJobType(job?.jobType || [])
                    .withQuantity(job?.quantity || 0)
                    .withIndustry(job?.industry || "")
                    .withCountry(job?.country || "")
                    .withCity(job?.city || "")
                    .withLocation(job.location)
                    .withLogo("")
                    .withSalary(job.salary || 0)
                    .withTime(job.hours)
                    .withExpireDate(job.expirationDate)
                    .withDatePosted(job.createdAt)
                    .withDescription(job.description || "")
                    .withResponsibilities(job.responsibilities || ["Không có mô tả về trách nhiệm!"])
                    .withSkillAndExperience(job.skillAndExperience || ["Không có mô tả về kỹ năng và kinh nghiệm!"])
                    .build();
            })
          );
        }
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
                let companyDto: Partial<CompanyResponseDto> | null = null;
                if (job.companyId) {
                    let company = await this.companyService.findById(job.companyId.toString());
                    companyDto = CompanyResponseDto.builder()
                        .withId(company._id.toString())
                        .withEmail(company.email)
                        .withName(company.name)
                        .withUserId(company.userId.toString())
                        .withPrimaryIndustry(company.primaryIndustry)
                        .withSize(company.size)
                        .withFoundedIn(company.foundedIn)
                        .withDescription(company.description)
                        .withPhone(company.phone)
                        .withAddress(company.address)
                        .withLogo(company.logo)
                        .withSocialMedias(company.socialMedias)
                        .withCreatedBy(company.createdBy)
                        .withUpdatedBy(company.updatedBy)
                        .withDeletedBy(company.deletedBy)
                        .withIsDeleted(company.isDeleted)
                        .withCreatedAt(company.createdAt)
                        .withUpdatedAt(company.updatedAt)
                        .build();
                }
        
                return JobResponseDto.builder()
                    .withId(job._id.toString())
                    .withCompany(companyDto)
                    .withDestination(null)
                    .withJobTitle(job.name)
                    .withJobType(job?.jobType || [])
                    .withQuantity(job?.quantity || 0)
                    .withIndustry(job?.industry || "")
                    .withCountry(job?.country || "")
                    .withCity(job?.city || "")
                    .withLocation(job.location)
                    .withLogo("")
                    .withSalary(job.salary || 0)
                    .withTime(job.hours)
                    .withExpireDate(job.expirationDate)
                    .withDatePosted(job.createdAt)
                    .withDescription(job.description || "")
                    .withResponsibilities(job.responsibilities || ["Không có mô tả về trách nhiệm!"])
                    .withSkillAndExperience(job.skillAndExperience || ["Không có mô tả về kỹ năng và kinh nghiệm!"])
                    .build();
            })
          );
        return {
            statusCode: HttpStatus.OK,
            message: "Lấy danh sách công việc thành công!",
            results: listJobResponseDto || [],
        }
    }

    @Get('detail/:id')
    @HttpCode(200)
    async GetJobById(@Param('id') id: string) {
        const job = await this.jobService.GetById(id);
        
        let companyDto: Partial<CompanyResponseDto> | null = null;
        if (job && job.companyId) {
            let company = await this.companyService.findById(job.companyId.toString());
            companyDto = CompanyResponseDto.builder()
                .withId(company._id.toString())
                .withEmail(company.email)
                .withName(company.name)
                .withUserId(company.userId.toString())
                .withPrimaryIndustry(company.primaryIndustry)
                .withSize(company.size)
                .withFoundedIn(company.foundedIn)
                .withDescription(company.description)
                .withPhone(company.phone)
                .withAddress(company.address)
                .withLogo(company.logo)
                .withSocialMedias(company.socialMedias)
                .withCreatedBy(company.createdBy)
                .withUpdatedBy(company.updatedBy)
                .withDeletedBy(company.deletedBy)
                .withIsDeleted(company.isDeleted)
                .withCreatedAt(company.createdAt)
                .withUpdatedAt(company.updatedAt)
                .build();
        }

        let responseDto = {}
        if (job) {
            responseDto = JobResponseDto.builder()
                .withId(job._id.toString())
                .withCompany(companyDto)
                .withDestination(null)
                .withJobTitle(job.name)
                .withJobType(job?.jobType || [])
                .withQuantity(job?.quantity || 0)
                .withIndustry(job?.industry || "")
                .withCountry(job?.country || "")
                .withCity(job?.city || "")
                .withLocation(job.location)
                .withLogo("")
                .withSalary(job.salary || 0)
                .withTime(job.hours)
                .withExpireDate(job.expirationDate)
                .withDatePosted(job.createdAt)
                .withDescription(job.description || "")
                .withResponsibilities(job.responsibilities || ["Không có mô tả về trách nhiệm!"])
                .withSkillAndExperience(job.skillAndExperience || ["Không có mô tả về kỹ năng và kinh nghiệm!"])
                .build();
        }
        return {
            statusCode: HttpStatus.OK,
            message: "Lấy công việc thành công!",
            data: responseDto || {},
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
            statusCode: HttpStatus.OK,
            message: "Cập nhật công việc thành công!",
            data: update || {},
        }
    }  

    @Delete(':id')
    @HttpCode(200)
    async DeleteJob(@Param('id') id: string) {
        const update = await this.jobService.SoftDeleteService(id);
        return {
            statusCode: HttpStatus.OK,
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
            statusCode: HttpStatus.OK,
            message: "Lấy danh sách danh mục thành công!",
            data: data || [],
        }
    }

    // MaxSalary
    @Get('max-salary')
    @HttpCode(200)
    async GetMaxSalary() {
        const data = await this.jobService.GetMaxSalary();
        return {
            statusCode: HttpStatus.OK,
            message: "Lấy mức lương cao nhất thành công!",
            data: data || {},
        }
    }

    // RelatedJob
    @Get('related-jobs/:id')
    @HttpCode(200)
    async GetRelatedJobs(
        @Param('id') id: string,
        @Query('industry') industry: string,
        @Query('country') country: string,
        @Query('city') city: string
    ) {
        const data = await this.jobService.GetRelatedJobs(id, industry, country, city);
        const listJobResponseDto = await Promise.all(
            data.map(async (job) => {
                let companyDto: Partial<CompanyResponseDto> | null = null;
                if (job.companyId) {
                    let company = await this.companyService.findById(job.companyId.toString());
                    companyDto = CompanyResponseDto.builder()
                        .withId(company._id.toString())
                        .withEmail(company.email)
                        .withName(company.name)
                        .withUserId(company.userId.toString())
                        .withPrimaryIndustry(company.primaryIndustry)
                        .withSize(company.size)
                        .withFoundedIn(company.foundedIn)
                        .withDescription(company.description)
                        .withPhone(company.phone)
                        .withAddress(company.address)
                        .withLogo(company.logo)
                        .withSocialMedias(company.socialMedias)
                        .withCreatedBy(company.createdBy)
                        .withUpdatedBy(company.updatedBy)
                        .withDeletedBy(company.deletedBy)
                        .withIsDeleted(company.isDeleted)
                        .withCreatedAt(company.createdAt)
                        .withUpdatedAt(company.updatedAt)
                        .build();
                }
        
                return JobResponseDto.builder()
                    .withId(job._id.toString())
                    .withCompany(companyDto)
                    .withDestination(null)
                    .withJobTitle(job.name)
                    .withJobType(job?.jobType || [])
                    .withQuantity(job?.quantity || 0)
                    .withIndustry(job?.industry || "")
                    .withCountry(job?.country || "")
                    .withCity(job?.city || "")
                    .withLocation(job.location)
                    .withLogo("")
                    .withSalary(job.salary || 0)
                    .withTime(job.hours)
                    .withExpireDate(job.expirationDate)
                    .withDatePosted(job.createdAt)
                    .withDescription(job.description || "")
                    .withResponsibilities(job.responsibilities || ["Không có mô tả về trách nhiệm!"])
                    .withSkillAndExperience(job.skillAndExperience || ["Không có mô tả về kỹ năng và kinh nghiệm!"])
                    .build();
            })
          );
        return {
            statusCode: HttpStatus.OK,
            message: "Lấy danh sách công việc liên quan thành công!",
            results: listJobResponseDto || [],
        }
    }
}
