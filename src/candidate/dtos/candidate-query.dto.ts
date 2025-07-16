import { IntersectionType } from "@nestjs/mapped-types";
import { Type } from "class-transformer";
import { IsOptional, IsString } from "class-validator";
import { QueryPaginationDto } from "src/common/dtos/query-pagination.dto";

class CandidateBaseDto {
    
    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsString()
    location?: string;

    @IsOptional()
    @IsString()
    industry?: string;

    @IsOptional()
    @Type(() => Number)
    experience?: number;

    @IsOptional()
    @IsString()
    education?: string;

    @IsOptional()
    @IsString()
    gender?: string;
}

export class CandidateQueryDto extends IntersectionType(
    QueryPaginationDto,
    CandidateBaseDto
) {

}