import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, ValidationPipe } from '@nestjs/common';
import { QueryPaginationDto } from 'src/common/dtos/query-pagination.dto';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dtos/create-company.dto';
import { UpdateCompanyDto } from './dtos/update-company.dto';
import { CompanyQueryDto } from './dtos/company-query.dto';
import { CompanyResponseDto } from './dtos/response/company-response.dto';
import { JobResponseDto } from 'src/job/dtos/response/job-response.dto';

@Controller('api/v1/company')
export class CompanyController {
    constructor(private readonly companyService: CompanyService) {}

    @Get()
    @HttpCode(HttpStatus.OK)
    async GetListPagination(
        @Query() queryPagination: CompanyQueryDto
    ) {
        const { data, total } = await this.companyService.GetListPagination(queryPagination);
        let listCompanyResponseDto: Partial<CompanyResponseDto>[] = [];
        if (data) {
            listCompanyResponseDto = await Promise.all(
                data.map(async (company) => {
                    return CompanyResponseDto.builder()
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
                        .withJobNumber(company.jobNumber)
                        .withLogo(company.logo)
                        .withSocialMedias(company.socialMedias)
                        .withCreatedBy(company.createdBy)
                        .withUpdatedBy(company.updatedBy)
                        .withDeletedBy(company.deletedBy)
                        .build();
                })
            );
        }

        return {
            statusCode: HttpStatus.OK,
            message: 'Lấy danh sách công ty phân trang thành công!',
            results: listCompanyResponseDto || [],
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
        const listCompany = await this.companyService.GetList();
        return {
            statusCode: HttpStatus.OK,
            message: "Lấy danh sách công ty thành công!",
            results: listCompany || [],
        }
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async CreateCompany(@Body(new ValidationPipe()) data: CreateCompanyDto) {
        const company = await this.companyService.CreateService(data);
        return {
            statusCode: HttpStatus.CREATED,
            message: "Tạo công ty thành công!",
            data: company || {},
        }
    }

    @Patch(':id')
    @HttpCode(HttpStatus.OK)
    async UpdatePartitionCompany(@Param('id') id: string, @Body() data: UpdateCompanyDto) {
        const update = await this.companyService.UpdatePartition(id, data);
        return {
            statusCode: HttpStatus.CREATED,
            message: "Cập nhật công ty thành công!",
            data: update || {},
        }
    }  

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    async DeleteCompany(@Param('id') id: string) {
        const update = await this.companyService.SoftDeleteService(id);
        return {
            statusCode: HttpStatus.CREATED,
            message: "Xóa công ty thành công!",
            data: update || {},
        }
    }

    @Get('details/:id')
    @HttpCode(HttpStatus.OK)
    async GetCompanyById(@Param('id') id: string) {
        const company = await this.companyService.findById(id);
        const jobCount = await this.companyService.countJobsByCompanyId(id);
        const companyResponse = CompanyResponseDto.builder()
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
                        .withJobNumber(jobCount)
                        .withLogo(company.logo)
                        .withSocialMedias(company.socialMedias)
                        .withCreatedBy(company.createdBy)
                        .withUpdatedBy(company.updatedBy)
                        .withDeletedBy(company.deletedBy)
                        .build();
        return {
            statusCode: HttpStatus.OK,
            message: "Lấy thông tin công ty thành công!",
            data: companyResponse || {},
        }
    }

    @Get('related-jobs/:companyId')
    @HttpCode(HttpStatus.OK)
    async GetRelatedJobs(@Param('companyId') companyId: string) {
        const data = await this.companyService.getRelatedJobsByCompanyId(companyId);
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
            message: "Lấy danh sách công việc liên quan bằng companyId thành công!",
            results: listJobResponseDto || [],
        }
    }
}
