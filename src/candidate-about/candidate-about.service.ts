import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CandidateAbout } from './candidate-about.schema';
import { CreateCandidateAboutDto } from './dtos/create-candidate-about.dto';
import { GlobalException } from 'src/CustomExceptions/global.exception';
import { UpdateCandidateAboutDto } from './dtos/update-candidate-about.dto';
import { QueryPaginationDto } from 'src/common/dtos/query-pagination.dto';

@Injectable()
export class CandidateAboutService {
  constructor(
    @InjectModel(CandidateAbout.name)
    private candidateAboutModel: Model<CandidateAbout>,
  ) {}

  async createService(data: CreateCandidateAboutDto) {
    try {
      const res = await this.candidateAboutModel.create(data);
      return res;
    } catch (error) {
      // Nếu lỗi đã là HttpException (gồm cả GlobalException) thì ném lại
      if (error instanceof HttpException) {
        throw error;
      }

      console.error('Lỗi tạo thông tin ứng viên:', error.message);
      throw new InternalServerErrorException(
        'Không thể tạo thông tin ứng viên vì lỗi kết nối cơ sở dữ liệu',
      );
    }
  }

  async getListPagination(
    queryPagination: QueryPaginationDto,
  ): Promise<{ data: CandidateAbout[]; total: number }> {
    try {
      const skip = (queryPagination.page - 1) * queryPagination.size;

      const [data, total] = await Promise.all([
        this.candidateAboutModel
          .find()
          .sort(queryPagination.sort)
          .skip(skip)
          .limit(queryPagination.size)
          .exec(),
        this.candidateAboutModel.countDocuments().exec(),
      ]);

      return { data, total };
    } catch (error) {
      console.error('Lỗi kết nối cơ sở dữ liệu:', error.message);
      throw new InternalServerErrorException(
        'Không thể lấy danh sách thông tin ứng viên vì lỗi kết nối cơ sở dữ liệu',
      );
    }
  }

  async getList(): Promise<CandidateAbout[]> {
    try {
      return this.candidateAboutModel.find().exec();
    } catch (error) {
      console.error('Lỗi kết nối cơ sở dữ liệu:', error.message);
      throw new InternalServerErrorException(
        'Không thể lấy danh sách thông tin ứng viên vì lỗi kết nối cơ sở dữ liệu',
      );
    }
  }

  async updatePartition(
    id: string,
    data: UpdateCandidateAboutDto,
  ): Promise<CandidateAbout> {
    try {
      const updated = await this.candidateAboutModel.findByIdAndUpdate(
        id,
        data,
        {
          new: true,
          runValidators: true,
        },
      );

      if (!updated) {
        throw new NotFoundException(
          `Không tìm thấy thông tin ứng viên với id: ${id}`,
        );
      }

      return updated;
    } catch (error) {
      // Nếu lỗi đã là HttpException (gồm cả GlobalException) thì ném lại
      if (error instanceof HttpException) {
        throw error;
      }

      console.error('Lỗi cập nhật thông tin ứng viên:', error.message);
      throw new InternalServerErrorException(
        'Không thể cập nhật thông tin ứng viên vì lỗi kết nối cơ sở dữ liệu',
      );
    }
  }

  async deleteById(id: string) {
    try {
      const deleted = await this.candidateAboutModel.findByIdAndDelete(id);
      if (!deleted) {
        throw new NotFoundException(
          `Không tìm thấy thông tin ứng viên với id: ${id}`,
        );
      }
      return deleted;
    } catch (error) {
      // Nếu lỗi đã là HttpException (gồm cả GlobalException) thì ném lại
      if (error instanceof HttpException) {
        throw error;
      }

      console.error('Lỗi cập nhật thông tin ứng viên:', error.message);
      throw new InternalServerErrorException(
        'Không thể cập nhật thông tin ứng viên vì lỗi kết nối cơ sở dữ liệu',
      );
    }
  }

  async getByCandidateId(id: string) {
    try {
      const candidateAbouts = await this.candidateAboutModel
        .find({ candidateId: id })
        .exec();
      if (!candidateAbouts) {
        throw new NotFoundException(
          `Không tìm thấy thông tin ứng viên với userId: ${id}`,
        );
      }
      return candidateAbouts;
    } catch (error) {
      // Nếu lỗi đã là HttpException (gồm cả GlobalException) thì ném lại
      if (error instanceof HttpException) {
        throw error;
      }

      console.error('Lỗi tìm kiếm thông tin bằng cấp ứng viên:', error.message);
      throw new InternalServerErrorException(
        'Không thể tìm kiếm thông tin bằng cấp ứng viên vì lỗi kết nối cơ sở dữ liệu',
      );
    }
  }

  // <!------------ Helper Functions ------------!>
  formatTime(start: any, end: any): string {
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    };

    const startDate = start ? new Date(start) : null;
    const endDate = end ? new Date(end) : null;

    if (!startDate && !endDate) {
      return 'N/A';
    }

    const startStr =
      startDate && !isNaN(startDate.getTime())
        ? new Intl.DateTimeFormat('en-US', options).format(startDate)
        : 'Invalid';

    const endStr =
      endDate && !isNaN(endDate.getTime())
        ? new Intl.DateTimeFormat('en-US', options).format(endDate)
        : 'Present';

    return `${startStr} - ${endStr}`;
  }
}
