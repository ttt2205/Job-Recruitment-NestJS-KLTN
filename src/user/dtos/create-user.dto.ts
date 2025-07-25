import { Type } from "class-transformer";
import { IsEmail, IsIn, IsNotEmpty, IsString } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty({message: "Vui lòng nhập email!"})
    @IsString()
    @IsEmail({}, {message: "Email không hợp lệ!"})
    email: string;

    @IsNotEmpty({message: "Vui lòng nhập mật khẩu!"})
    @Type(() => String)
    password: string;

    @IsNotEmpty({message: "Vui lòng nhập loại người dùng!"})
    @IsString()
    @IsIn(['admin', 'company', 'candidate'], {
        message: 'Loại người dùng chỉ được là: admin, company hoặc candidate!',
    })

    @IsNotEmpty({message: "Vui lòng cung cấp loại cho tài khoản"})
    @IsString()
    @IsIn(['admin', 'company', 'candidate'], {
        message: 'Loại người dùng chỉ được là: admin, company hoặc candidate!',
    })
    type: string; // admin, company, candidate
}