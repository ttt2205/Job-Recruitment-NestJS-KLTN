import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Job } from './job.schema';
import { Model, Types } from 'mongoose';
import { CreateJobDto } from './dtos/create-job.dto';
import { GlobalException } from 'src/CustomExceptions/global.exception';
import { UpdateJobDto } from './dtos/update-job.dto';
import { JobQueryDto } from './dtos/job-query.dto';

@Injectable()
export class JobService {
  constructor(@InjectModel(Job.name) private jobModel: Model<Job>) {}

  async CreateService(data: CreateJobDto) {
    try {
      const existJob = await this.jobModel.findOne({
        companyId: data.companyId,
        name: data.name,
      });
      if (existJob) {
        throw new GlobalException(
          'Công việc đã tồn tại!',
          'Công việc',
          'đã tồn tại',
          HttpStatus.CONFLICT,
        );
      }
      const job = await this.jobModel.create(data);
      return job;
    } catch (error) {
      // Nếu lỗi đã là HttpException (gồm cả GlobalException) thì ném lại
      if (error instanceof HttpException) {
        throw error;
      }

      console.error('Lỗi tạo công việc:', error.message);
      throw new InternalServerErrorException(
        'Không thể tạo công việc vì lỗi kết nối cơ sở dữ liệu',
      );
    }
  }

  async GetListPagination(queryPagination: JobQueryDto) {
    try {
      // Size
      const skip = (queryPagination.page - 1) * queryPagination.size;
      // Sort
      const sortQuery = {};
      if (queryPagination.sort) {
        const [field, order] = queryPagination.sort.split('_');
        if (field && order) {
          sortQuery[field] = order === 'asc' ? 1 : -1;
        }
      }
      // Query Params
      const search = queryPagination?.search;
      const location = queryPagination?.location;
      const category = queryPagination?.category;
      const type = queryPagination?.type?.split('-').join(' ');
      const datePosted = queryPagination?.datePosted;
      const experience = queryPagination?.experience;
      const minSalary = queryPagination?.min;
      const maxSalary = queryPagination?.max;
      const currency = queryPagination?.currency;

      // Search conditions
      const searchConditions = search
        ? [
            { name: { $regex: search, $options: 'i' } },
            { level: { $regex: search, $options: 'i' } },
          ]
        : [];

      // Location conditions
      const locationConditions = location
        ? [
            { country: { $regex: location, $options: 'i' } },
            { city: { $regex: location, $options: 'i' } },
          ]
        : [];

      // Category/Industry condition
      const categoryCondition = category ? { industry: category } : {};

      // Type condition
      const typeCondition = type
        ? { 'jobType.type': { $regex: type, $options: 'i' } }
        : {};

      // Experience condition
      const experienceCondition = experience
        ? { experience: { $lte: parseInt(experience) } }
        : {};

      // Date posted condition (giả sử lọc theo số ngày gần đây)
      let datePostedCondition = {};

      if (datePosted && datePosted !== 'all') {
        const now = new Date();
        let fromDate: Date | null = null;

        switch (datePosted) {
          case 'last-hour':
            fromDate = new Date(now.getTime() - 1 * 60 * 60 * 1000); // 1 giờ
            break;
          case 'last-24-hour':
            fromDate = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24 giờ
            break;
          case 'last-7-days':
            fromDate = new Date(now); // copy now
            fromDate.setDate(fromDate.getDate() - 7); // trừ 7 ngày
            break;
          case 'last-14-days':
            fromDate = new Date(now); // copy now
            fromDate.setDate(fromDate.getDate() - 14); // trừ 14 ngày
            break;
          case 'last-30-days':
            fromDate = new Date(now); // copy now
            fromDate.setDate(fromDate.getDate() - 30); // trừ 30 ngày
            break;
          default:
            break;
        }

        if (fromDate) {
          datePostedCondition = {
            createdAt: { $gte: fromDate },
          };
        }
      }

      // Salary condition
      let salaryCondition = {};
      if (minSalary && maxSalary) {
        salaryCondition = {
          ...(minSalary !== undefined
            ? { 'salary.max': { $gte: minSalary } }
            : {}),
          ...(maxSalary !== undefined
            ? { 'salary.max': { $lte: maxSalary } }
            : {}),
        };
      }

      // Thêm điều kiện lọc theo currency (nếu có)
      if (currency) {
        salaryCondition['salary.currency'] = currency;
      }

      // Combine all conditions
      const combinedQuery = {
        $and: [
          ...(searchConditions.length ? [{ $or: searchConditions }] : []),
          ...(locationConditions.length ? [{ $or: locationConditions }] : []),
          categoryCondition,
          typeCondition,
          experienceCondition,
          datePostedCondition,
          salaryCondition,
        ],
      };

      const [data, total] = await Promise.all([
        this.jobModel
          .find(combinedQuery)
          .sort(sortQuery)
          .skip(skip)
          .limit(queryPagination.size)
          .exec(),
        this.jobModel.countDocuments().exec(),
      ]);
      return { data, total };
    } catch (error) {
      console.error('Lỗi kết nối cơ sở dữ liệu:', error);
      throw new InternalServerErrorException(
        'Không thể lấy danh sách công việc vì lỗi kết nối cơ sở dữ liệu',
      );
    }
  }

  async GetList() {
    try {
      return this.jobModel.find().exec();
    } catch (error) {
      console.error('Lỗi kết nối cơ sở dữ liệu:', error.message);
      throw new InternalServerErrorException(
        'Không thể lấy danh sách công việc vì lỗi kết nối cơ sở dữ liệu',
      );
    }
  }

  async GetById(id: string) {
    try {
      const job = this.jobModel.findById(id).exec();
      return job;
    } catch (error) {
      console.error('Lỗi kết nối cơ sở dữ liệu:', error.message);
      throw new InternalServerErrorException(
        'Không thể lấy công việc vì lỗi kết nối cơ sở dữ liệu',
      );
    }
  }

  async UpdatePartition(id: string, data: UpdateJobDto): Promise<Job> {
    try {
      const updated = await this.jobModel.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      });

      if (!updated) {
        throw new NotFoundException(`Không tìm thấy công việc với id: ${id}`);
      }

      return updated;
    } catch (error) {
      // Nếu lỗi đã là HttpException (gồm cả GlobalException) thì ném lại
      if (error instanceof HttpException) {
        throw error;
      }

      console.error('Lỗi cập nhật công việc:', error.message);
      throw new InternalServerErrorException(
        'Không thể cập nhật công việc vì lỗi kết nối cơ sở dữ liệu',
      );
    }
  }

  async SoftDeleteService(id: string): Promise<Job> {
    try {
      const updated = await this.jobModel.findByIdAndUpdate(
        id,
        { isDeleted: true },
        { new: true, runValidators: true },
      );

      if (!updated) {
        throw new NotFoundException(`Không tìm thấy công việc với id: ${id}`);
      }

      return updated;
    } catch (error) {
      // Nếu lỗi đã là HttpException (gồm cả GlobalException) thì ném lại
      if (error instanceof HttpException) {
        throw error;
      }

      console.error('Lỗi cập nhật công việc:', error.message);
      throw new InternalServerErrorException(
        'Không thể cập nhật công việc vì lỗi kết nối cơ sở dữ liệu',
      );
    }
  }

  async getMaxSalaryWithCurrency(currency?: string) {
    try {
      // Xây điều kiện tìm kiếm
      const filter: any = { 'salary.max': { $ne: null } };
      if (currency) {
        filter['salary.currency'] = currency;
      }

      // Tìm job có lương cao nhất theo currency (nếu có)
      const job = await this.jobModel
        .findOne(filter)
        .sort({ 'salary.max': -1 }) // sắp xếp giảm dần
        .lean() // giảm tải dữ liệu không cần thiết
        .exec();

      // Lấy giá trị max salary
      const maxSalary = job?.salary?.max ?? 0;

      console.log(`Max salary (${currency ?? 'ALL'}):`, maxSalary);
      return maxSalary;
    } catch (error) {
      console.error('Lỗi lấy mức lương cao nhất:', error.message);
      throw new InternalServerErrorException(
        'Không thể lấy mức lương cao nhất vì lỗi kết nối cơ sở dữ liệu',
      );
    }
  }

  async GetRelatedJobs(
    id: string,
    industryQuery?: string,
    countryQuery?: string,
    cityQuery?: string,
  ) {
    try {
      // 1. Lấy job gốc để biết industry (trong trường hợp không truyền tham số)
      const currentJob = await this.jobModel.findById(id).exec();
      if (!currentJob) {
        throw new NotFoundException('Không tìm thấy công việc hiện tại');
      }

      const combinedQuery: any = {
        _id: { $ne: new Types.ObjectId(id) }, // loại bỏ job hiện tại
      };

      // 2. Ưu tiên dùng industryQuery, nếu không có thì fallback về currentJob.industry
      if (typeof industryQuery === 'string' && industryQuery.trim() !== '') {
        combinedQuery.industry = { $regex: industryQuery, $options: 'i' };
      } else {
        combinedQuery.industry = { $regex: currentJob.industry, $options: 'i' };
      }

      // 3. Thêm điều kiện country nếu có
      if (typeof countryQuery === 'string' && countryQuery.trim() !== '') {
        combinedQuery.country = { $regex: countryQuery, $options: 'i' };
      }

      // 4. Thêm điều kiện city nếu có
      if (typeof cityQuery === 'string' && cityQuery.trim() !== '') {
        combinedQuery.city = { $regex: cityQuery, $options: 'i' };
      }

      // 5. Tìm job liên quan
      const relatedJobs = await this.jobModel.find(combinedQuery).exec();
      return relatedJobs;
    } catch (error) {
      console.error('Lỗi lấy danh sách công việc liên quan:', error.message);
      throw new InternalServerErrorException(
        'Không thể lấy danh sách công việc liên quan vì lỗi kết nối cơ sở dữ liệu',
      );
    }
  }

  async countJobsByCompanyId(companyId: string) {
    try {
      const count = await this.jobModel
        .countDocuments({ companyId: new Types.ObjectId(companyId) })
        .exec();
      return count;
    } catch (error) {
      console.error(
        `Lỗi lấy số lượng công việc của companyId=${companyId}:`,
        error.message,
      );
      throw new InternalServerErrorException(
        `Không thể lấy số lượng công việc của companyId=${companyId} vì lỗi kết nối cơ sở dữ liệu`,
      );
    }
  }

  async getRelatedJobsByCompanyId(companyId: string) {
    try {
      const relatedJobs = await this.jobModel
        .find({ companyId: new Types.ObjectId(companyId) })
        .exec();
      return relatedJobs;
    } catch (error) {
      console.error(
        `Lỗi lấy công việc liên quan bằng companyId=${companyId}:`,
        error.message,
      );
      throw new InternalServerErrorException(
        `Không thể lấy công việc liên quan bằng companyId${companyId} vì lỗi kết nối cơ sở dữ liệu`,
      );
    }
  }

  async GetListByKey(key: string) {
    try {
      const listValue = await this.jobModel.find().distinct(key).exec();
      return listValue || [];
    } catch (error) {
      console.error(`Lỗi lấy danh sách ${key}:`, error.message);
      throw new InternalServerErrorException(
        `Không thể lấy danh sách ${key} vì lỗi kết nối cơ sở dữ liệu`,
      );
    }
  }

  async GetCategoryListByKeyAndCompanyId(
    key: string,
    companyId: string | number,
  ) {
    try {
      const listValue = await this.jobModel
        .find({
          companyId: companyId,
        })
        .distinct(key)
        .exec();
      return listValue || [];
    } catch (error) {
      console.error(
        `Lỗi lấy danh sách ${key} của công ty ${companyId}:`,
        error.message,
      );
      throw new InternalServerErrorException(
        `Không thể lấy danh sách ${key} của công ty ${companyId} vì lỗi kết nối cơ sở dữ liệu`,
      );
    }
  }

  async GetListJobByCompanyId(id: string) {
    try {
      const listValue = await this.jobModel
        .find({
          companyId: id,
        })
        .exec();
      return listValue || [];
    } catch (error) {
      console.error(
        `Lỗi lấy danh sách  công việc theo companyId:`,
        error.message,
      );
      throw new InternalServerErrorException(
        `Không thể lấy danh sách công việc theo companyId vì lỗi kết nối cơ sở dữ liệu`,
      );
    }
  }
}
