import { Type } from "class-transformer";
import { IsBoolean, IsNumber, IsString } from "class-validator";

export class JobSalary {

    @IsNumber()
    @Type(() => Number)
    min: number;

    @IsNumber()
    @Type(() => Number)
    max: number;

    @IsString()
    currency: string;

    @IsString()
    unit: string;

    @IsBoolean()
    negotiable: boolean; // thỏa thuận
}