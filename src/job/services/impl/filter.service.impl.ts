import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { FilterService } from '../filter.service';
import { InjectModel } from '@nestjs/mongoose';
import { Job } from 'src/job/job.schema';
import { Model } from 'mongoose';
import { JobQueryDto } from 'src/job/dtos/job-query.dto';

@Injectable()
export class FilterServiceImpl extends FilterService {
  constructor(@InjectModel(Job.name) private readonly jobModel: Model<Job>) {
    super();
  }

  async filterJobsByCompanyIdForDashboard(
    id: string | number,
    queryPagination: JobQueryDto,
  ) {
    try {
      // Size
      const skip = (queryPagination.page - 1) * queryPagination.size;
      // Tạo query
      let query: any = {
        companyId: id,
      };

      if (queryPagination.category && queryPagination.category.trim() !== '') {
        query.industry = queryPagination.category;
      }

      // if (queryPagination.time && queryPagination.time > 0) {
      //   // Tính thời gian bắt đầu dựa trên tham số time
      //   const now = new Date();
      //   let pastDate = new Date();
      //   pastDate.setMonth(now.getMonth() - queryPagination.time);
      //   query.createdAt = { $gte: pastDate };
      // }

      // Query with MongoDB:
      const [data, total] = await Promise.all([
        this.jobModel.find(query).skip(skip).limit(queryPagination.size).exec(),
        this.jobModel.countDocuments().exec(),
      ]);
      return { data, total };
    } catch (error) {
      console.error('Lỗi kết nối cơ sở dữ liệu:', error.message);
      throw new InternalServerErrorException(
        'Không thể lấy danh sách công việc của công ty vì lỗi kết nối cơ sở dữ liệu',
      );
    }
  }
}
