import { Type } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty({message: "Vui lòng nhập email!"})
    @IsString()
    @IsEmail({}, {message: "Email không hợp lệ!"})
    email: string;

    @IsNotEmpty({message: "Vui lòng nhập mật khẩu!"})
    @Type(() => String)
    password: string;
}