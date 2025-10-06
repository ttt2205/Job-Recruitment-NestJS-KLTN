import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { ResumeService } from './resume.service';
import { ResumeResponseDto } from './dtos/response/resume.response.dto';

@Controller('api/v1/resume')
export class ResumeController {
    constructor(
        private readonly resumeService: ResumeService
    ) {}
        
    @Get('candidate/:id')
    @HttpCode(200)
    async GetResumeListOfCandidate(@Param('id') id: string) {
        const data = await this.resumeService.getResumeListByCandidateId(id);
        let responseDto: [] | ResumeResponseDto[] = [];
        if (data) {
            responseDto = data.map((item) =>
                ResumeResponseDto.builder()
                    .withId(item._id.toString())
                    .withCandidateId(item.candidateId.toString())
                    .withFileName(item.fileName || "")
                    .build()
                );
        }
        return {
            statusCode: HttpStatus.OK,
            message: "Lấy danh sách hồ sơ xin việc thành công!",
            results: responseDto || [],
        }
    }
}
