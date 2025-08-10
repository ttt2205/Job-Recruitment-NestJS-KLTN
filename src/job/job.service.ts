import { HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
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
            // Size
            const skip = (queryPagination.page - 1) * queryPagination.size;
            // Sort
            const sortQuery = {};
            if (queryPagination.sort) {
                const [field, order] = queryPagination.sort.split("_");
                if (field && order) {
                    sortQuery[field] = order === "asc" ? 1 : -1;
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
                { country: { $regex: location, $options: 'i' }},
                { city: { $regex: location, $options: 'i' }},
            ]
            : [];

            // Category/Industry condition
            const categoryCondition = category ? { industry: category } : {};

            // Type condition
            const typeCondition = type ? { "jobType.type": { $regex: type, $options: "i" }} : {};

            // Experience condition
            const experienceCondition = experience ? { experience: { $lte: parseInt(experience) }} : {};

            // Date posted condition (giả sử lọc theo số ngày gần đây)
            let datePostedCondition = {};

            if (datePosted && datePosted !== "all") {
                const now = new Date();
                let fromDate: Date | null = null;

                switch (datePosted) {
                    case "last-hour":
                        fromDate = new Date(now.getTime() - 1 * 60 * 60 * 1000); // 1 giờ
                        break;
                    case "last-24-hour":
                        fromDate = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24 giờ
                        break;
                    case "last-7-days":
                        fromDate = new Date(now); // copy now
                        fromDate.setDate(fromDate.getDate() - 7); // trừ 7 ngày
                        break;
                    case "last-14-days":
                        fromDate = new Date(now); // copy now
                        fromDate.setDate(fromDate.getDate() - 14); // trừ 14 ngày
                        break;
                    case "last-30-days":
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
            if (minSalary !== undefined || maxSalary !== undefined) {
                salaryCondition = {
                    salary: {
                    ...(minSalary !== undefined ? { $gte: minSalary } : {}),
                    ...(maxSalary !== undefined ? { $lte: maxSalary } : {}),
                    },
                };
            }

            // Combine all conditions
            const combinedQuery = {
            ...(searchConditions.length ? { $or: searchConditions } : {}),
            ...(locationConditions.length ? { $or: locationConditions } : {}),
            ...categoryCondition,
            ...typeCondition,
            ...experienceCondition,
            ...datePostedCondition,
            ...salaryCondition,
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

    async GetById(id: string) {
        try {
            const job = this.jobModel.findById(id).exec();
            return job;
        } catch (error) {
            console.error('Lỗi kết nối cơ sở dữ liệu:', error.message);
            throw new InternalServerErrorException(
                'Không thể lấy công việc vì lỗi kết nối cơ sở dữ liệu'
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

    async GetMaxSalary() {
        try {
            const job = await this.jobModel
            .findOne({ 'salary.max': { $ne: null } }) // loại bỏ job không có max
            .sort({ 'salary.max': -1 })               // sắp xếp giảm dần theo salary.max
            .exec();

            const maxSalary = job?.salary?.max || 0;

            console.log("maxSalary:", maxSalary);
            return maxSalary;
        } catch (error) {
            console.error('Lỗi lấy mức lương cao nhất:', error.message);
            throw new InternalServerErrorException(
            'Không thể lấy mức lương cao nhất vì lỗi kết nối cơ sở dữ liệu'
            );
        }
    }

    async GetRelatedJobs(id: string, industryQuery: string, countryQuery: string, cityQuery: string) {
        try {
            const combinedQuery: any = {
                _id: { $ne: new Types.ObjectId(id) },
            };

            if (typeof industryQuery === 'string' && industryQuery.trim() !== '') {
                combinedQuery.industry = { $regex: industryQuery, $options: 'i' };
            }

            if (typeof countryQuery === 'string' && countryQuery.trim() !== '') {
                combinedQuery.country = { $regex: countryQuery, $options: 'i' };
            }

            if (typeof cityQuery === 'string' && cityQuery.trim() !== '') {
                combinedQuery.city = { $regex: cityQuery, $options: 'i' };
            }
            const relatedJobs = await this.jobModel.find(combinedQuery).exec();
            console.log("relatedJobs: ", relatedJobs)
            return relatedJobs;
        } catch (error) {
            console.error('Lỗi lấy danh sách công việc liên quan:', error.message);
            throw new InternalServerErrorException(
                'Không thể lấy danh sách công việc liên quan vì lỗi kết nối cơ sở dữ liệu'
            );
        }
    }

    async countJobsByCompanyId(companyId: string) {
        try {
            const count = await this.jobModel.countDocuments({ companyId: new Types.ObjectId(companyId) }).exec();
            return count;
        } catch (error) {
            console.error(`Lỗi lấy số lượng công việc của companyId=${companyId}:`, error.message);
            throw new InternalServerErrorException(
                `Không thể lấy số lượng công việc của companyId=${companyId} vì lỗi kết nối cơ sở dữ liệu`
            );
        }
    }

    async getRelatedJobsByCompanyId(companyId: string) {
        try {
            const relatedJobs = await this.jobModel.find({ companyId: new Types.ObjectId(companyId) }).exec();
            return relatedJobs;
        } catch (error) {
            console.error(`Lỗi lấy công việc liên quan bằng companyId=${companyId}:`, error.message);
            throw new InternalServerErrorException(
                `Không thể lấy công việc liên quan bằng companyId${companyId} vì lỗi kết nối cơ sở dữ liệu`
            );
        }
    }

    async GetListByKey(key: string) {
        try {
            const listSkill = await this.jobModel.find().distinct(key).exec();
            console.log("listSkill: ", listSkill)
            return listSkill || [];
        } catch (error) {
            console.error(`Lỗi lấy danh sách  công v${key} iệc:`, error.message);
            throw new InternalServerErrorException(
                `Không thể lấy danh sách ${key} công việc vì lỗi kết nối cơ sở dữ liệu`
            );
        }
    }
}
