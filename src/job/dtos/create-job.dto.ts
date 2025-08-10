import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsDate, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, Max, MaxLength } from "class-validator";
import { JobType } from "./job-type.dto";
import { JobSalary } from "./job-salary.dto";
import { JobWorkTime } from "../job-work-time.schema";

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

    @IsObject()
    @IsOptional()
    salary?: JobSalary;

    @IsString()
    @IsNotEmpty({message: "Vui lòng nhập trình độ tuyển dụng!"})
    level: string;

    @IsArray()
    @IsNotEmpty({message: 'Thêm mô tả trách nhiệm cần thực hiện!'})
    responsibilities: string[]; 

    @IsArray()
    @IsNotEmpty({message: 'Thêm mô tả kỹ năng và kinh nghiệm cần có!'})
    skillAndExperience: string[]; 

    @IsNotEmpty({message: 'Thêm mô tả kinh nghiệm!'})
    @Type(() => Number)
    experience: number; 

    @IsObject()
    @IsOptional()
    workTime?: JobWorkTime;

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