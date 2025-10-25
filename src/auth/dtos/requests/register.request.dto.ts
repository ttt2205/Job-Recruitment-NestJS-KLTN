import { IsIn, IsNotEmpty, IsString } from 'class-validator';

export class RegisterRequestDto {
  @IsNotEmpty({ message: 'Vui lòng nhập email!' })
  email: string;

  @IsNotEmpty({ message: 'Vui lòng nhập mật khẩu!' })
  password: string;

  @IsNotEmpty({ message: 'Không xác định được loại người dùng!' })
  @IsString()
  @IsIn(['company', 'candidate'], {
    message: 'Quyền người dùng chỉ được là: admin, company hoặc candidate!',
  })
  role: string;
}
