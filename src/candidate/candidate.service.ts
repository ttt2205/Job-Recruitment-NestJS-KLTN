import { HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCandidateDto } from './dtos/create-candidate.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Candidate } from './candidate.shema';
import { Model } from 'mongoose';
import { GlobalException } from 'src/CustomExceptions/global.exception';
import { UpdateCandidateDto } from './dtos/update-candidate-dto';
import { QueryPaginationDto } from 'src/common/dtos/query-pagination.dto';

@Injectable()
export class CandidateService {
    constructor(@InjectModel(Candidate.name) private candidateModel: Model<Candidate>) {}

    async CreateService(data: CreateCandidateDto) {
        try {
            const existCandidate = await this.candidateModel.findOne({
                userId: data.userId
            });
            if (existCandidate) {
                throw new GlobalException("Hồ sơ ứng viên đã tồn tại!", "Hồ sơ ứng viên", "đã tồn tại", HttpStatus.CONFLICT);
            }
            const candidate = await this.candidateModel.create(data);
            return candidate;
        } catch (error) {
            // Nếu lỗi đã là HttpException (gồm cả GlobalException) thì ném lại
            if (error instanceof HttpException) {
                throw error;
            }

            console.error('Lỗi tạo hồ sơ ứng viên:', error.message);
            throw new InternalServerErrorException(
                'Không thể tạo hồ sơ ứng viên vì lỗi kết nối cơ sở dữ liệu'
            );
        }
    }

    async GetListPagination(queryPagination: QueryPaginationDto): Promise<{ data: Candidate[]; total: number }> {
        try {
            const skip = (queryPagination.page - 1) * queryPagination.size;

            const [data, total] = await Promise.all([
                this.candidateModel
                .find()
                .sort(queryPagination.sort)
                .skip(skip)
                .limit(queryPagination.size)
                .exec(),
                this.candidateModel.countDocuments().exec(),
            ]);

            return { data, total };
        } catch (error) {
            console.error('Lỗi kết nối cơ sở dữ liệu:', error.message);
            throw new InternalServerErrorException(
                'Không thể lấy danh sách ứng viên vì lỗi kết nối cơ sở dữ liệu'
            );
        }
    }

    async GetList(): Promise<Candidate[]> {
        try {
            return this.candidateModel.find().exec();
        } catch (error) {
            console.error('Lỗi kết nối cơ sở dữ liệu:', error.message);
            throw new InternalServerErrorException(
                'Không thể lấy danh sách ứng viên vì lỗi kết nối cơ sở dữ liệu'
            );
        }
    }
    
    async UpdatePartition(id: string, data: UpdateCandidateDto):Promise<Candidate> {
        try {
            const updated = await this.candidateModel.findByIdAndUpdate(id, data, {
                new: true,
                runValidators: true,
            })

            if (!updated) {
                throw new NotFoundException(`Không tìm thấy ứng viên với id: ${id}`)
            }

            return updated;
        } catch (error) {
            // Nếu lỗi đã là HttpException (gồm cả GlobalException) thì ném lại
            if (error instanceof HttpException) {
                throw error;
            }

            console.error('Lỗi cập nhật ứng viên:', error.message);
            throw new InternalServerErrorException(
                'Không thể cập nhật ứng viên vì lỗi kết nối cơ sở dữ liệu'
            );
        }
    }

    async SoftDeleteService(id: string):Promise<Candidate> {
        try {
            const updated = await this.candidateModel.findByIdAndUpdate(
                id,
                { isDeleted: true },
                { new: true, runValidators: true },
            );
    
            if (!updated) {
                throw new NotFoundException(`Không tìm thấy ứng viên với id: ${id}`);
            }
    
            return updated;
        } catch (error) {
            // Nếu lỗi đã là HttpException (gồm cả GlobalException) thì ném lại
            if (error instanceof HttpException) {
                throw error;
            }

            console.error('Lỗi cập nhật ứng viên:', error.message);
            throw new InternalServerErrorException(
                'Không thể cập nhật ứng viên vì lỗi kết nối cơ sở dữ liệu'
            );
        }
    }
}
