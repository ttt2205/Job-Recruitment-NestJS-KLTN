import { HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Job } from './job.schema';
import { Model } from 'mongoose';
import { CreateJobDto } from './dtos/create-job.dto';
import { GlobalException } from 'src/CustomExceptions/global.exception';
import { UpdateJobDto } from './dtos/update-job.dto';
import { QueryPaginationDto } from 'src/common/dtos/query-pagination.dto';
import { JobQueryDto } from './dtos/job-query.dto';
import { types } from 'util';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class JobService {
    constructor(@InjectModel(Job.name) private jobModel: Model<Job>) {}

    async CreateService(data: CreateJobDto) {
        try {
            const existJob = await this.jobModel.findOne({
                companyId: data.companyId,
                name: data.name
            });
            if (existJob) {
                throw new GlobalException("Công việc đã tồn tại!", "Công việc", "đã tồn tại", HttpStatus.CONFLICT);
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
                'Không thể tạo công việc vì lỗi kết nối cơ sở dữ liệu'
            );
        }
    }

    async GetListPagination(queryPagination: JobQueryDto) {
        try {
            // size
            const skip = (queryPagination.page - 1) * queryPagination.size;
            // Sort
            const sortQuery = {};
            if (queryPagination.sort) {
                const [field, order] = queryPagination.sort.split("_");
                if (field && order) {
                    sortQuery[field] = order === "asc" ? 1 : -1;
                }
            }

            const [data, total] = await Promise.all([
                this.jobModel
                .find()
                .sort(sortQuery)
                .skip(skip)
                .limit(queryPagination.size)
                .exec(),
                this.jobModel.countDocuments().exec(),
            ]);

            return { data, total };
        } catch (error) {
            console.error('Lỗi kết nối cơ sở dữ liệu:', error.message);
            throw new InternalServerErrorException(
                'Không thể lấy danh sách công việc vì lỗi kết nối cơ sở dữ liệu'
            );
        }
    }

    async GetList() {
        try {
            return this.jobModel.find().exec();
        } catch (error) {
            console.error('Lỗi kết nối cơ sở dữ liệu:', error.message);
            throw new InternalServerErrorException(
                'Không thể lấy danh sách công việc vì lỗi kết nối cơ sở dữ liệu'
            );
        }
    }
    
    async UpdatePartition(id: string, data: UpdateJobDto):Promise<Job> {
        try {
            const updated = await this.jobModel.findByIdAndUpdate(
                id, 
                data, 
                {
                    new: true,
                    runValidators: true,
                }
            )

            if (!updated) {
                throw new NotFoundException(`Không tìm thấy công việc với id: ${id}`)
            }

            return updated;
        } catch (error) {
            // Nếu lỗi đã là HttpException (gồm cả GlobalException) thì ném lại
            if (error instanceof HttpException) {
                throw error;
            }

            console.error('Lỗi cập nhật công việc:', error.message);
            throw new InternalServerErrorException(
                'Không thể cập nhật công việc vì lỗi kết nối cơ sở dữ liệu'
            );
        }
    }

    async SoftDeleteService(id: string):Promise<Job> {
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
                'Không thể cập nhật công việc vì lỗi kết nối cơ sở dữ liệu'
            );
        }
    }

    async GetListCategory() {
        try {
            const listCategory = await this.jobModel.find().select('industry').exec();
            console.log("listCategory: ", listCategory)
            const listCategoryResponse = listCategory.map(instance => instance.industry);
            return listCategoryResponse;
        } catch (error) {
            console.error('Lỗi lấy danh sách danh mục công việc:', error.message);
            throw new InternalServerErrorException(
                'Không thể lấy danh sách danh mục công việc vì lỗi kết nối cơ sở dữ liệu'
            );
        }
    }

    async GetMaxSalary() {
        try {
            const job = await this.jobModel.findOne().sort({ salary: -1 }).exec();
            const maxSalary = job?.salary || 0;
            console.log("maxSalary: ", maxSalary)
            return maxSalary;
        } catch (error) {
            console.error('Lỗi lấy mức lương cao nhất:', error.message);
            throw new InternalServerErrorException(
                'Không thể lấy mức lương cao nhất vì lỗi kết nối cơ sở dữ liệu'
            );
        }
    }
}
