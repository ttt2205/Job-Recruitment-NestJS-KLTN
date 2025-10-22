import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
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
import { ApplicationQueryDto } from './dtos/queries/application.query.dto';

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
      // kiểm tra ứng viên có tồn tại
      await this.candidateService.getCandidateById(
        createApplicationDto.candidateId,
      );
      // Kiểm tra job có tồn tại
      await this.jobService.getById(createApplicationDto.jobId);
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

  async getPaginationByCandidateId(
    id: string,
    queryPagination: ApplicationQueryDto,
  ) {
    try {
      // Size
      const skip = (queryPagination.page - 1) * queryPagination.size;
      // Tạo query
      let query: any = {
        candidateId: id,
        status: queryPagination.status
          ? queryPagination.status
          : { $in: ['PENDING', 'REVIEWED', 'ACCEPTED', 'REJECTED'] },
      };

      if (queryPagination.datePosted && queryPagination.datePosted > 0) {
        const now = new Date();
        const fromDate = new Date(now);
        fromDate.setDate(fromDate.getDate() - queryPagination.datePosted); // trừ đi số ngày tương ứng
        query.createdAt = { $gte: queryPagination.datePosted };
      }

      // Query with MongoDB:
      const [data, total] = await Promise.all([
        this.applicationModel
          .find(query)
          .skip(skip)
          .limit(queryPagination.size)
          .exec(),
        this.applicationModel.countDocuments().exec(),
      ]);
      return { data, total };
    } catch (error) {
      console.error('Lỗi kết nối cơ sở dữ liệu:', error.message);
      throw new InternalServerErrorException(
        'Không thể lấy danh sách đơn ứng tuyển của ứng viên vì lỗi kết nối cơ sở dữ liệu',
      );
    }
  }
}
