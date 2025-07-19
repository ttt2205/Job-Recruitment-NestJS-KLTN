import { HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CandidateAbout } from './candidate-about.shema';
import { CreateCandidateAboutDto } from './dtos/create-candidate-about.dto';
import { GlobalException } from 'src/CustomExceptions/global.exception';
import { UpdateCandidateAboutDto } from './dtos/update-candidate-about.dto';
import { QueryPaginationDto } from 'src/common/dtos/query-pagination.dto';

@Injectable()
export class CandidateAboutService {
    constructor(@InjectModel(CandidateAbout.name) private candidateAboutModel: Model<CandidateAbout>) {}
    
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
                'Không thể tạo thông tin ứng viên vì lỗi kết nối cơ sở dữ liệu'
            );
        }
    }

    async getListPagination(queryPagination: QueryPaginationDto): Promise<{ data: CandidateAbout[]; total: number }> {
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
                'Không thể lấy danh sách thông tin ứng viên vì lỗi kết nối cơ sở dữ liệu'
            );
        }
    }

    async getList(): Promise<CandidateAbout[]> {
        try {
            return this.candidateAboutModel.find().exec();
        } catch (error) {
            console.error('Lỗi kết nối cơ sở dữ liệu:', error.message);
            throw new InternalServerErrorException(
                'Không thể lấy danh sách thông tin ứng viên vì lỗi kết nối cơ sở dữ liệu'
            );
        }
    }
    
    async updatePartition(id: string, data: UpdateCandidateAboutDto):Promise<CandidateAbout> {
        try {
            const updated = await this.candidateAboutModel.findByIdAndUpdate(id, data, {
                new: true,
                runValidators: true,
            })

            if (!updated) {
                throw new NotFoundException(`Không tìm thấy thông tin ứng viên với id: ${id}`)
            }

            return updated;
        } catch (error) {
            // Nếu lỗi đã là HttpException (gồm cả GlobalException) thì ném lại
            if (error instanceof HttpException) {
                throw error;
            }

            console.error('Lỗi cập nhật thông tin ứng viên:', error.message);
            throw new InternalServerErrorException(
                'Không thể cập nhật thông tin ứng viên vì lỗi kết nối cơ sở dữ liệu'
            );
        }
    }

    async softDeleteService(id: string):Promise<CandidateAbout> {
        try {
            const updated = await this.candidateAboutModel.findByIdAndUpdate(
                id,
                { isDeleted: true },
                { new: true, runValidators: true },
            );
    
            if (!updated) {
                throw new NotFoundException(`Không tìm thấy thông tin ứng viên với id: ${id}`);
            }
    
            return updated;
        } catch (error) {
            // Nếu lỗi đã là HttpException (gồm cả GlobalException) thì ném lại
            if (error instanceof HttpException) {
                throw error;
            }

            console.error('Lỗi cập nhật thông tin ứng viên:', error.message);
            throw new InternalServerErrorException(
                'Không thể cập nhật thông tin ứng viên vì lỗi kết nối cơ sở dữ liệu'
            );
        }
    }

    async getByUserId(userId: string) {
        try {
            const candidateAbouts = await this.candidateAboutModel.find({ userId: userId }).exec();
            if (!candidateAbouts) {
                throw new NotFoundException(`Không tìm thấy thông tin ứng viên với userId: ${userId}`);
            }
            return candidateAbouts;
        } catch (error) {
            // Nếu lỗi đã là HttpException (gồm cả GlobalException) thì ném lại
            if (error instanceof HttpException) {
                throw error;
            }

            console.error('Lỗi tìm kiếm thông tin bằng cấp ứng viên:', error.message);
            throw new InternalServerErrorException(
                'Không thể tìm kiếm thông tin bằng cấp ứng viên vì lỗi kết nối cơ sở dữ liệu'
            );
        }
    }
}
