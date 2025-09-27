import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateCandidateAboutDto {
    @IsNotEmpty({message: "Vui lòng chọn ứng viên!"})
    candidateId: string;

    @IsNotEmpty({message: "Vui lòng chọn tiêu đề!"})
    @IsString()
    category: string;

    @IsNotEmpty({message: "Vui lòng nhập vị trí công việc!"})
    @IsString()
    title: string;

    @IsNotEmpty({message: "Vui lòng nhập đơn vị công tác!"})
    @IsString()
    organization: string;

    @IsOptional()
    startTime?: Date;

    @IsOptional()
    endTime?: Date;

    @IsOptional()
    @IsString()
    text?: string;
}