import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from "class-validator";
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
    birthday?: Date;

    @IsOptional()
    @IsString({message: "Số điện thoại không hợp lệ!"})
    @MaxLength(15, {message: "Số điện thoại không hợp lệ!"})
    phone?: string;

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
    country?: string;

    @IsOptional()
    @IsString()
    city?: string;

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
    expectedSalary?: string;

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

    @IsOptional()
    @IsBoolean()
    status?: boolean = false;
}