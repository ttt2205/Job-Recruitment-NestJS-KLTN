import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { FilterService } from '../filter.service';
import { InjectModel } from '@nestjs/mongoose';
import { Job } from 'src/job/job.schema';
import { Model } from 'mongoose';

@Injectable()
export class FilterServiceImpl extends FilterService {
  constructor(@InjectModel(Job.name) private readonly jobModel: Model<Job>) {
    super();
  }

  async filterJobsByCompanyIdForDashboard(
    id: string | number,
    category?: string,
    time?: number,
  ): Promise<any[]> {
    try {

      // Tạo query
      let query: any = {
        companyId: id,
      };

      if (category && category.trim() !== '') {
        query.industry = category;
      }

      if (time && time > 0) {
        // Tính thời gian bắt đầu dựa trên tham số time
        const now = new Date();
        let pastDate = new Date();
        pastDate.setMonth(now.getMonth() - time);
        query.createdAt = { $gte: pastDate };
      }

      // Query with MongoDB:
      const jobs = await this.jobModel.find(query).exec();

      return jobs;
    } catch (error) {
      console.error('Lỗi kết nối cơ sở dữ liệu:', error.message);
      throw new InternalServerErrorException(
        'Không thể lấy danh sách công việc của công ty vì lỗi kết nối cơ sở dữ liệu',
      );
    }
  }
}
