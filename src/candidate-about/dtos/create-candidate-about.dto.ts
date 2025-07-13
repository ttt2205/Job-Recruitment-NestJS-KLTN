import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateCandidateAboutDto {
    @IsNotEmpty({message: "Vui lòng chọn ứng viên!"})
    userId: string;

    @IsNotEmpty({message: "Vui lòng chọn tiêu đề!"})
    @IsString()
    title: string;

    @IsNotEmpty({message: "Vui lòng nhập vị trí công việc!"})
    @IsString()
    name: string;

    @IsNotEmpty({message: "Vui lòng nhập đơn vị công tác!"})
    @IsString()
    industry: string;

    @IsNotEmpty({message: "Vui lòng nhập khoảng thời gian công tác!"})
    @IsString()
    time: string;

    @IsOptional()
    @IsString()
    text?: string;
}