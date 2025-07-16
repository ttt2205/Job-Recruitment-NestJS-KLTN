import { Type } from "class-transformer";
import { IsArray, IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from "class-validator";
import { SocilMedia } from "src/common/dtos/social-media.dto";

export class CreateCandidateDto {
    
    @IsNotEmpty({message: "Tạo hồ sơ không thành công vì userId không hợp lệ!"})
    userId: string;

    @IsNotEmpty({message: "Vui lòng nhập tên!"})
    @IsString({message: "Tên không hợp lệ!"})
    @MaxLength(100, {message: "Tên không hợp lệ!"})
    name: string;

    @IsOptional()
    @Type(() => Date)
    @IsDate({message: "Định dạng ngày sinh không hợp lệ!"})
    age?: Date;

    @IsOptional()
    @IsString({message: "Ngành nghề không hợp lệ!"})
    industry?: string; // == category

    @IsArray()
    @IsOptional()
    skills?: string[];

    @IsOptional()
    @IsString()
    avatar?: string;

    @IsOptional()
    @IsString()
    designation?: string;

    @IsOptional()
    @IsString()
    location?: string;

    @IsOptional()
    @IsNumber({}, {message: "Vui lòng nhập chữ số!"})
    hourlyRate?: number;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    experience?: string;

    @IsOptional()
    @IsString()
    currentSalary?: string;

    @IsOptional()
    @IsString()
    expectSalary?: string;

    @IsOptional()
    @IsString()
    gender?: string;

    @IsOptional()
    @IsArray()
    language?: string[];

    @IsOptional()
    @IsString()
    educationLevel?: string;

    @IsOptional()
    socialMedias?: SocilMedia[];
}