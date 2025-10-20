import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Application } from './application.schema';
import { Model } from 'mongoose';
import { JobService } from 'src/job/job.service';
import { CandidateService } from 'src/candidate/candidate.service';
import { CreateApplicationDto } from './dtos/requests/create-application.dto';
import { handleServiceError } from 'src/common/helpers/handle.service.error';
import { ResumeService } from 'src/resume/resume.service';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectModel(Application.name)
    private readonly applicationModel: Model<Application>,
    private readonly jobService: JobService,
    private readonly candidateService: CandidateService,
    private readonly resumeService: ResumeService,
  ) {}

  async createApplication(
    createApplicationDto: CreateApplicationDto,
  ): Promise<Application> {
    try {
      // const existingApplication = await this.applicationModel.findOne({
      //   candidateId: createApplicationDto.candidateId,
      //   jobId: createApplicationDto.jobId,
      // });

      // if (existingApplication) {
      //   throw new ConflictException(
      //     'Bạn đã ứng tuyển vào công việc này trước đó.',
      //   );
      // }

      // kiểm tra ứng viên có tồn tại
      await this.candidateService.getCandidateById(
        createApplicationDto.candidateId,
      );
      // Kiểm tra job có tồn tại
      await this.jobService.GetById(createApplicationDto.jobId);
      // Kiểm tra resume có tồn tại
      const resume = await this.resumeService.getResumeById(
        createApplicationDto.resumeId,
      );
      // Copy resume tử folder images/resumes sang folder images/applications
      const fs = require('fs');
      const path = require('path');
      const sourcePath = path.join(
        __dirname,
        '../../images/resumes/',
        resume.fileName,
      );
      const destPath = path.join(
        __dirname,
        '../../images/applications/',
        resume.fileName,
      );
      fs.copyFileSync(sourcePath, destPath);
      // Tạo application mới
      return await this.applicationModel.create({
        candidateId: createApplicationDto.candidateId,
        jobId: createApplicationDto.jobId,
        resumeId: createApplicationDto.resumeId,
        fileName: resume.fileName,
        coverLetter: createApplicationDto.coverLetter || '',
        status: 'PENDING',
      });
    } catch (error) {
      handleServiceError(error, 'ApplicationService.createApplication');
    }
  }

  async hasCandidateApplied(candidateId: string, jobId: string) {
    try {
      const instance = await this.applicationModel.findOne({
        candidateId,
        jobId,
      });
      return instance ? true : false;
    } catch (error) {
      handleServiceError(
        error,
        'ApplicationService.getApplicationsByCandidateIdAndJobId',
      );
    }
  }
}
