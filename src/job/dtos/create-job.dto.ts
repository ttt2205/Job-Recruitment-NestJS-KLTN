import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, Max, MaxLength } from "class-validator";
import { JobType } from "./job-type.dto";

export class CreateJobDto {
    @IsString({message: 'Tên phải là một chuỗi gồm chữ và số'})
    @IsNotEmpty({message: 'Tên không được để trống'})
    @MaxLength(100, {message: 'Tên không được quá 100 ký tự'})
    name: string;

    @IsNotEmpty({message: "Vui lòng chọn công ty đăng tuyển!"})
    companyId: string;

    @IsOptional()
    description?: string;

    @IsOptional()
    @IsArray()
    @Type(() => JobType)
    jobType?: JobType[]; // ex: Fulltime, Intern Ship

    @IsNumber()
    @IsNotEmpty({message: 'Vui lòng nhập mức lương!'})
    salary: number;

    @IsString()
    @IsNotEmpty({message: "Vui lòng nhập trình độ tuyển dụng!"})
    level: string;

    @IsString()
    @IsNotEmpty({message: 'Thêm mô tả trách nhiệm cần thực hiện!'})
    @Type(() => String)
    responsibilities: string; 

    @IsNotEmpty({message: 'Thêm mô tả kinh nghiệm!'})
    @Type(() => Number)
    experience: number; 

    @IsString()
    @IsNotEmpty()
    hours: string; // ex: 8:00am - 9:00pm

    @IsString()
    industry: string; // ex: Infomation Technology

    @IsNumber()
    quantity: number;

    @IsString()
    country: string;

    @IsString()
    city: string;

    @IsString()
    @IsNotEmpty({message: "Vui lòng cập nhật địa chỉ!"})
    location: string;

    @IsDate({message: "Vui lòng chọn ngày hợp lệ!"})
    expirationDate: Date;

    @IsOptional()
    @IsArray()
    skills?: string[];

    @IsBoolean({ message: "isActive phải là kiểu boolean!" })
    @IsOptional()
    isActive?: boolean;

}