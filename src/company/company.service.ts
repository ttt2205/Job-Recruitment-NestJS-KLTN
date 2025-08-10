import { HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Company } from './company.schema';
import { Model } from 'mongoose';
import { CreateCompanyDto } from './dtos/create-company.dto';
import { GlobalException } from 'src/CustomExceptions/global.exception';
import { UpdateCompanyDto } from './dtos/update-company.dto';
import { QueryPaginationDto } from 'src/common/dtos/query-pagination.dto';
import { CompanyQueryDto } from './dtos/company-query.dto';
import { JobService } from 'src/job/job.service';

@Injectable()
export class CompanyService {
    constructor(
        @InjectModel(Company.name) private companyModel: Model<Company>,
        private readonly jobService: JobService, // Inject JobService to access job-related methods
    ) {}

    async CreateService(data: CreateCompanyDto) {
        try {
            const existCompany = await this.companyModel.findOne({
                userId: data.userId
            });
            if (existCompany) {
                throw new GlobalException("Công ty đã tồn tại!", "Công ty", "đã tồn tại", HttpStatus.CONFLICT);
            }
            const company = await this.companyModel.create(data);
            return company;
        } catch (error) {
            // Nếu lỗi đã là HttpException (gồm cả GlobalException) thì ném lại
            if (error instanceof HttpException) {
                throw error;
            }

            console.error('Lỗi tạo hồ sơ công ty:', error.message);
            throw new InternalServerErrorException(
                'Không thể tạo hồ sơ công ty vì lỗi kết nối cơ sở dữ liệu'
            );
        }
    }

    async GetListPagination(queryPagination: CompanyQueryDto) {
        try {
            // Size
            const skip = (queryPagination.page - 1) * queryPagination.size;

            // Sort
            const sortQuery = {};
            if (queryPagination.sort) {
                const [field, order] = queryPagination.sort.split("_");
                console.log("field: ", field, " order: ", order);
                if (field && order) {
                    sortQuery[field] = order === "asc" ? 1 : -1;
                }
            }

            // Filter
            const search = queryPagination.search;
            const location = queryPagination.location;
            const category = queryPagination.category;
            const foundationDateMin = queryPagination.foundationDateMin;
            const foundationDateMax = queryPagination.foundationDateMax;
            const primaryIndustry = queryPagination.primaryIndustry;

            const searchQuery = search ? {
                $or: [
                    { name: { $regex: search, $options: "i" } },
                    { email: { $regex: search, $options: "i" } }
                ]
            } : {};

            const locationQuery = location ? {
                address: { $regex: location, $options: "i" }
            } : {}

            const categoryQuery = category ? {
                primaryIndustry: { $regex: category, $options: "i" }
            } : {};

            const foundationDateQuery = foundationDateMin &&  foundationDateMax ? {
                foundedIn: { $gte: foundationDateMin, $lte: foundationDateMax }
            } : {};

            const primaryIndustryQuery = primaryIndustry ? {
                primaryIndustry: { $regex: primaryIndustry, $options: "i" }
            } : {};

            // And
            const combineQuery = {
                ...searchQuery,
                ...locationQuery,
                ...categoryQuery,
                ...foundationDateQuery,
                ...primaryIndustryQuery,
            };


            const [data, total] = await Promise.all([
                this.companyModel
                .find(combineQuery)
                .sort(sortQuery)
                .skip(skip)
                .limit(queryPagination.size)
                .exec(),
                this.companyModel.countDocuments().exec(),
            ]);

            // Job count for each company
            const companiesWithJobCount = await Promise.all(
                data.map(async (company) => {
                    const jobCount = await this.jobService.countJobsByCompanyId(company._id.toString());
                    return {
                        ...company.toObject(),
                        jobNumber: jobCount, // Add job count to the company object
                    };
                })
            );

            return { data: companiesWithJobCount, total };
        } catch (error) {
            console.error('Lỗi kết nối cơ sở dữ liệu:', error.message);
            throw new InternalServerErrorException(
                'Không thể lấy danh sách công ty vì lỗi kết nối cơ sở dữ liệu'
            );
        }
    }

    async GetList() {
        try {
            return this.companyModel.find().exec();
        } catch (error) {
            console.error('Lỗi kết nối cơ sở dữ liệu:', error.message);
            throw new InternalServerErrorException(
                'Không thể lấy danh sách công ty vì lỗi kết nối cơ sở dữ liệu'
            );
        }
    }

    async findById(id: string) {
        let company: Company | null;
        try {
            company = await this.companyModel.findOne({ _id: id }).exec();
        } catch (error) {
          // Chỉ bắt lỗi MongoDB, lỗi cú pháp, v.v.
          if (error.name === 'CastError') {
            throw new NotFoundException(`ID không hợp lệ: ${id}`);
          }
          console.error('Lỗi truy vấn công ty:', error.message);
          throw new InternalServerErrorException('Lỗi kết nối đến cơ sở dữ liệu');
        }
      
        if (!company) {
          throw new NotFoundException(`Không tìm thấy công ty với ID: ${id}`);
        }
      
        return company;
    }

    async getCompanyByUseIdNullable(id: string): Promise<Company | null> {
        try {
            return await this.companyModel.findOne({userId: id}).exec();
        } catch (error) {
            console.error("Lối DB khi lấy thông tin công ty: ", error);
            return null;
        }
    }

    async countJobsByCompanyId(companyId: string): Promise<number> {
        try {
            return this.jobService.countJobsByCompanyId(companyId);
        } catch (error) {
            console.error('Lỗi đếm số lượng công việc:', error.message);
            throw new InternalServerErrorException(
                'Không thể đếm số lượng công việc vì lỗi kết nối cơ sở dữ liệu'
            );
        }
    }

    async getRelatedJobsByCompanyId(companyId: string) {
        try {
            return this.jobService.getRelatedJobsByCompanyId(companyId);
        } catch (error) {
            console.error('Lỗi đếm số lượng công việc:', error.message);
            throw new InternalServerErrorException(
                'Không thể đếm số lượng công việc vì lỗi kết nối cơ sở dữ liệu'
            );
        }
    }
    
    async UpdatePartition(id: string, data: UpdateCompanyDto):Promise<Company> {
        try {
            const updated = await this.companyModel.findByIdAndUpdate(id, data, {
                new: true,
                runValidators: true,
            })

            if (!updated) {
                throw new NotFoundException(`Không tìm thấy công ty với id: ${id}`)
            }

            return updated;
        } catch (error) {
            // Nếu lỗi đã là HttpException (gồm cả GlobalException) thì ném lại
            if (error instanceof HttpException) {
                throw error;
            }

            console.error('Lỗi cập nhật công ty:', error.message);
            throw new InternalServerErrorException(
                'Không thể cập nhật công ty vì lỗi kết nối cơ sở dữ liệu'
            );
        }
    }

    async SoftDeleteService(id: string):Promise<Company> {
        try {
            const updated = await this.companyModel.findByIdAndUpdate(
                id,
                { isDeleted: true },
                { new: true, runValidators: true },
            );
    
            if (!updated) {
                throw new NotFoundException(`Không tìm thấy công ty với id: ${id}`);
            }
    
            return updated;
        } catch (error) {
            // Nếu lỗi đã là HttpException (gồm cả GlobalException) thì ném lại
            if (error instanceof HttpException) {
                throw error;
            }

            console.error('Lỗi cập nhật công ty:', error.message);
            throw new InternalServerErrorException(
                'Không thể cập nhật công ty vì lỗi kết nối cơ sở dữ liệu'
            );
        }
    }

    async getLogoOfCompany(id: string) {
        try {
            const logo = await this.companyModel.findById(id).select('logo').exec();
            return logo;
        } catch (error) {
            console.error('Lỗi lấy logo công ty:', error.message);
            throw new InternalServerErrorException(
                'Không thể lấy logo công ty vì lỗi kết nối cơ sở dữ liệu'
            );
        }
    }

    async getIndustryOfCompanies() {
        try {
            const industries = await this.companyModel.find().select("primaryIndustry").exec();
            return industries;
        } catch (error) {
            console.error('Lỗi lấy danh mục công ty:', error.message);
            throw new InternalServerErrorException(
                'Không thể lấy danh mục công ty vì lỗi kết nối cơ sở dữ liệu'
            );
        }
    }
}
