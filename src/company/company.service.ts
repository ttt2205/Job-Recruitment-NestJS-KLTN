import { HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Company } from './company.schema';
import { Model } from 'mongoose';
import { CreateCompanyDto } from './dtos/create-company.dto';
import { GlobalException } from 'src/CustomExceptions/global.exception';
import { UpdateCompanyDto } from './dtos/update-company.dto';
import { QueryPaginationDto } from 'src/common/dtos/query-pagination.dto';

@Injectable()
export class CompanyService {
    constructor(@InjectModel(Company.name) private companyModel: Model<Company>) {}

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

    async GetListPagination(queryPagination: QueryPaginationDto): Promise<{ data: Company[]; total: number }> {
        try {
            const skip = (queryPagination.page - 1) * queryPagination.size;
            const [data, total] = await Promise.all([
                this.companyModel
                .find()
                // .sort(queryPagination.sort)
                .skip(skip)
                .limit(queryPagination.size)
                .exec(),
                this.companyModel.countDocuments().exec(),
            ]);

            return { data, total };
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
            console.log("companyId: ", id)
            company = await this.companyModel.findOne({ _id: id }).exec();
            console.log("find by companyId: ", company)
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
}
