import { IsEmail, IsNotEmpty, IsOptional } from "class-validator";

export class CreateResumeDto {

    @IsNotEmpty({message: "Tạo resume không thành công vì userId không hợp lệ!"})
    userId?: string;

}