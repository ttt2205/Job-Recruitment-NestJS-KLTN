import { Type } from "class-transformer";
import { IsArray, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, ValidateNested } from "class-validator";
import { SocilMedia } from "../../common/dtos/social-media.dto";

export class CreateCompanyDto {

    @IsNotEmpty({message: "Tạo hồ sơ không thành công vì userId không hợp lệ!"})
    userId: string;

    @IsNotEmpty({message: "Email không được để trống!"})
    @IsString({ message: 'Email phải là chuỗi!' })
    @MaxLength(100, {message: "Độ dài email không hợp lệ!"})
    @IsOptional()
    @IsEmail({}, { message: 'Email không đúng định dạng!' })
    email?: string;

    @IsString()
    @IsNotEmpty({message: "Vui lòng nhập tên công ty!"})
    name: string;

    @IsString()
    @IsNotEmpty({message: "Vui lòng nhập lĩnh vực của công ty!"})
    primaryIndustry: string;

    @IsString()
    @IsOptional()
    size?: string;

    @IsNumber({} , {message: "Năm thành lập phải là số!"})
    @IsOptional()
    @Type(() => Number)
    foundedIn?: number;

    @IsOptional()
    description?: string;

    @IsNotEmpty({message: "Số điện thoại không được để trống!"})
    @MaxLength(15, {message: "Số điện thoại không hợp lệ!"})
    @Type(() => String)
    phone: string;

    @IsString()
    country?: string;

    @IsString()
    city?: string;

    @IsString()
    address?: string;

    @IsOptional()
    @IsString()
    logo?: string;

    @IsOptional()
    @IsString()
    website?: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => SocilMedia)
    @IsOptional()
    socialMedias?: SocilMedia[];
}