import { Type } from "class-transformer";
import { IsArray, IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from "class-validator";
import { SocilMedia } from "src/common/dtos/social-media.dto";

export class LoginRequestDto {
    
    @IsNotEmpty({message: "Vui lòng nhập email!"})
    email: string;

    @IsNotEmpty({message: "Vui lòng nhập mật khẩu!"})
    password: string;
}