import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateCandidateAboutDto {
    @IsNotEmpty({message: "Vui lòng chọn ứng viên!"})
    candidateId: string;

    @IsNotEmpty({message: "Vui lòng chọn tiêu đề!"})
    @IsString()
    title: string;

    @IsNotEmpty({message: "Vui lòng nhập vị trí công việc!"})
    @IsString()
    industry: string;

    @IsNotEmpty({message: "Vui lòng nhập đơn vị công tác!"})
    @IsString()
    business: string;

    @IsOptional()
    startTime?: Date;

    @IsOptional()
    endTime?: Date;

    @IsOptional()
    @IsString()
    text?: string;
}