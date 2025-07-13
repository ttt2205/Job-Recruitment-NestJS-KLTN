import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, ValidationPipe } from '@nestjs/common';
import { QueryPaginationDto } from 'src/common/dtos/query-pagination.dto';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dtos/create-company.dto';
import { UpdateCompanyDto } from './dtos/update-company.dto';

@Controller('api/v1/company')
export class CompanyController {
    constructor(private readonly companyService: CompanyService) {}

    @Get()
    @HttpCode(200)
    async GetListPagination(
        @Query() queryPagination: QueryPaginationDto
    ) {
        const { data, total } = await this.companyService.GetListPagination(queryPagination);
        return {
            statusCode: HttpStatus.OK,
            message: 'Lấy danh sách công ty phân trang thành công!',
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
        const listCompany = await this.companyService.GetList();
        return {
            statusCode: HttpStatus.OK,
            message: "Lấy danh sách công ty thành công!",
            results: listCompany || [],
        }
    }

    @Post()
    @HttpCode(201)
    async CreateCompany(@Body(new ValidationPipe()) data: CreateCompanyDto) {
        const company = await this.companyService.CreateService(data);
        return {
            statusCode: HttpStatus.CREATED,
            message: "Tạo công ty thành công!",
            data: company || {},
        }
    }

    @Patch(':id')
    @HttpCode(200)
    async UpdatePartitionCompany(@Param('id') id: string, @Body() data: UpdateCompanyDto) {
        const update = await this.companyService.UpdatePartition(id, data);
        return {
            statusCode: HttpStatus.CREATED,
            message: "Cập nhật công ty thành công!",
            data: update || {},
        }
    }  

    @Delete(':id')
    @HttpCode(200)
    async DeleteCompany(@Param('id') id: string) {
        const update = await this.companyService.SoftDeleteService(id);
        return {
            statusCode: HttpStatus.CREATED,
            message: "Xóa công ty thành công!",
            data: update || {},
        }
    }
}
