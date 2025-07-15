import { IntersectionType } from "@nestjs/mapped-types";
import { Type } from "class-transformer";
import { IsOptional, IsString } from "class-validator";
import { QueryPaginationDto } from "src/common/dtos/query-pagination.dto";

class CompanyBaseDto {
    
    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsString()
    location?: string;

    @IsOptional()
    @IsString()
    category?: string;

    @IsOptional()
    @IsString()
    primaryIndustry?: string;

    @IsOptional()
    @Type(() => Number)
    foundationDateMin?: number;

    @IsOptional()
    @Type(() => Number)
    foundationDateMax?: number;
}

export class CompanyQueryDto extends IntersectionType(
    QueryPaginationDto,
    CompanyBaseDto
) {

}