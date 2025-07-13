import { IsOptional, IsPositive, IsString } from "class-validator";

export class QueryPaginationDto {
    
    @IsPositive({message: "Tham số truyền vào không hợp lệ!"})
    page: number;

    @IsPositive({message: "Tham số truyền vào không hợp lệ!"})
    size: number;

    @IsOptional()
    @IsString()
    sort?: string;
}