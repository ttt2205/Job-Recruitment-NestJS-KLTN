import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Resume } from './resume.schema';
import { Model } from 'mongoose';
import { handleServiceError } from 'src/common/helpers/handle.service.error';

@Injectable()
export class ResumeService {
  constructor(@InjectModel(Resume.name) private resumeModel: Model<Resume>) {}

  async getResumeListByCandidateId(id: string) {
    try {
      const resumes = await this.resumeModel
        .find({
          candidateId: id,
        })
        .sort({ createdAt: -1 })
        .exec();
      return resumes;
    } catch (error) {
      console.error(
        'Lỗi lấy danh sách hồ sơ xin việc của ứng viên:',
        error.message,
      );
      throw new InternalServerErrorException(
        'Không thể lấy danh sách hồ sơ xin việc của ứng viên vì lỗi kết nối cơ sở dữ liệu',
      );
    }
  }

  async getTheNumberOfResumesByCandidateId(id: string) {
    try {
      return await this.resumeModel.countDocuments({ candidateId: id }).exec();
    } catch (error) {
      console.error(
        'Lỗi lấy số lượng danh sách hồ sơ xin việc của ứng viên:',
        error.message,
      );
      throw new InternalServerErrorException(
        'Không thể lấy số lượng danh sách hồ sơ xin việc của ứng viên vì lỗi kết nối cơ sở dữ liệu',
      );
    }
  }

  async getResumeById(id: string): Promise<Resume> {
    try {
      const resume = await this.resumeModel.findById(id).exec();
      if (!resume) {
        throw new InternalServerErrorException(
          `Không tìm thấy hồ sơ với id: ${id}`,
        );
      }
      return resume;
    } catch (error) {
      handleServiceError(error, 'ResumeService.getResumeById');
    }
  }
}
