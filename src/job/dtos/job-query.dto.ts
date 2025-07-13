import { IntersectionType } from "@nestjs/mapped-types";
import { Type } from "class-transformer";
import { IsOptional, IsString } from "class-validator";
import { QueryPaginationDto } from "src/common/dtos/query-pagination.dto";

class JobBaseDto {
    
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
    type?: string;

    @IsOptional()
    datePosted?: string;

    @IsOptional()
    @IsString()
    experience?: string;

    @IsOptional()
    @Type(() => Number)
    min?: number;

    @IsOptional()
    @Type(() => Number)
    max?: number;
}

export class JobQueryDto extends IntersectionType(
    QueryPaginationDto,
    JobBaseDto
) {

}