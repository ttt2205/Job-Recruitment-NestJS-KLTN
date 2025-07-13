import { IsEmail, IsNotEmpty, IsOptional } from "class-validator";

export class CreateResumeDto {

    @IsNotEmpty({message: "Tạo resume không thành công vì userId không hợp lệ!"})
    userId: number;

    @IsNotEmpty({message: "Tạo resume không thành công vì companyId không hợp lệ!"})
    companyId: number;

    @IsNotEmpty({message: "Tạo resume không thành công vì jobId không hợp lệ!"})
    jobId: number;

    @IsNotEmpty({message: "Email không được để trống"})
    @IsEmail({}, {message: "Email không hợp lệ!"})
    email: string;

    @IsOptional()
    history?: string[];

    @IsOptional()
    url?: string;

    @IsNotEmpty({message: "Vui lòng chọn trạng thái resume"})
    status: string;

}