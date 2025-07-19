import { HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCandidateDto } from './dtos/create-candidate.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Candidate } from './candidate.shema';
import { Model } from 'mongoose';
import { GlobalException } from 'src/CustomExceptions/global.exception';
import { UpdateCandidateDto } from './dtos/update-candidate-dto';
import { QueryPaginationDto } from 'src/common/dtos/query-pagination.dto';
import { CandidateQueryDto } from './dtos/candidate-query.dto';
import { CandidateAboutService } from 'src/candidate-about/candidate-about.service';

@Injectable()
export class CandidateService {
    constructor(
        @InjectModel(Candidate.name) private candidateModel: Model<Candidate>,
        private readonly candidateAboutService: CandidateAboutService
    ) {}

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

    async GetListPagination(queryPagination: CandidateQueryDto): Promise<{ data: Candidate[]; total: number }> {
        try {
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
            // Combine query with pagination and sorting
            const experienceQuery = queryPagination.experience ? { experience: { $lte: queryPagination.experience } } : {};
            const searchQuery = queryPagination.search ? { name: { $regex: queryPagination.search, $options: 'i' } } : {};
            const locationQuery = queryPagination.location ? { location: { $regex: queryPagination.location, $options: 'i' } } : {};
            const industryQuery = queryPagination.industry ? { industry: { $regex: queryPagination.industry, $options: 'i' } } : {};
            const genderQuery = queryPagination.gender ? { gender: { $regex: queryPagination.gender, $options: 'i' } } : {};

            let educationQuery = {};
            if (queryPagination.education === 'university') {
                educationQuery = { educationLevel: { $regex: 'Đại học', $options: 'i' } };
            } else if (queryPagination.education === 'college') {
                educationQuery = { educationLevel: { $regex: 'Cao đẳng', $options: 'i' } };
            } else if (queryPagination.education === 'other') {
                educationQuery = {
                    educationLevel: { $nin: ['Đại học', 'Cao đẳng'] }, // "not in"
                };
            }


            const combinedQuery = {
                isDeleted: false, // Chỉ lấy những ứng viên chưa bị xóa
                ...experienceQuery,
                ...searchQuery,
                ...locationQuery,
                ...industryQuery,
                ...genderQuery,
                ...educationQuery
            }

            const [data, total] = await Promise.all([
                this.candidateModel
                .find(combinedQuery)
                .sort(sortQuery)
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

    async GetListIndustryOfCandidate() {
        try {
            const industries = await this.candidateModel.distinct('industry').exec();
            return industries;
        } catch (error) {
            // Nếu lỗi đã là HttpException (gồm cả GlobalException) thì ném lại
            if (error instanceof HttpException) {
                throw error;
            }

            console.error('Lỗi lấy danh sách danh mục của các ứng viên:', error.message);
            throw new InternalServerErrorException(
                'Không thể lấy danh sách danh mục của ứng viên vì lỗi kết nối cơ sở dữ liệu'
            );
        }
    }

    async getCandidateById(id: string): Promise<Candidate> {
        try {
            const candidate = await this.candidateModel.findById(id).exec();
            if (!candidate) {
                throw new NotFoundException(`Không tìm thấy ứng viên với id: ${id}`);
            }
            return candidate;
        } catch (error) {
            // Nếu lỗi đã là HttpException (gồm cả GlobalException) thì ném lại
            if (error instanceof HttpException) {
                throw error;
            }

            console.error('Lỗi kết nối cơ sở dữ liệu:', error.message);
            throw new InternalServerErrorException(
                'Không thể lấy thông tin ứng viên vì lỗi kết nối cơ sở dữ liệu'
            );
        }
    }
}
