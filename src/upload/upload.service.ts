import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CandidateImage } from './candidate-images.shema';
import { Model } from 'mongoose';
import { CompanyImage } from './company-images.schema';
import { CompanyService } from 'src/company/company.service';
import { join } from 'path';
import { unlink } from 'fs/promises';
import { combineAll } from 'rxjs';
import { CandidateService } from 'src/candidate/candidate.service';
import { Resume } from 'src/resume/resume.schema';

const folderCompany = 'companies';
const folderCandidate = 'candidates';
const folderResume = 'resumes';
@Injectable()
export class UploadService {
    constructor(
        // Initialization logic if needed
        @InjectModel(CandidateImage.name) private candidateImageModel: Model<CandidateImage>,
        @InjectModel(CompanyImage.name) private companyImageModel: Model<CompanyImage>,
        @InjectModel(Resume.name) private resumeModel: Model<Resume>,
        private readonly companyService: CompanyService,
        private readonly candidateService: CandidateService
    ) {}

    // Company Image
    async getLogoOfCompanyById(id: string) {
        try {
            const res = await this.companyService.getLogoOfCompany(id);
            console.log("logo company: ", res)
            return res?.logo;
        } catch (error) {
            console.log("Lấy logo công ty không thành công do lỗi kết nối cơ sở dữ liệu!")
            throw new InternalServerErrorException(
                'Lấy logo công ty không thành công do lỗi kết nối cơ sở dữ liệu!'
            );
        }
    }

    async getImagesOfCompanyById(id: string) {
        try {
            const res = await this.companyImageModel.find({companyId: id}).select('filename').exec();
            console.log("images company: ", res)
            return res?.map((image) => image.filename);
        } catch (error) {
            console.log("Lấy ảnh công ty không thành công do lỗi kết nối cơ sở dữ liệu!")
            throw new InternalServerErrorException(
                'Lấy ảnh công ty không thành công do lỗi kết nối cơ sở dữ liệu!'
            );
        }
    }

    async uploadImageCompany(companyId: string, filename: string) {
        try {
            const companyImage = new this.companyImageModel({
                companyId: companyId,
                filename: filename,
            });
            return (await companyImage.save()).filename;
        } catch (error) {
            console.log("Lưu ảnh công ty không thành công do lỗi kết nối cơ sở dữ liệu!")
            throw new InternalServerErrorException(
                'Lưu ảnh công ty không thành công do lỗi kết nối cơ sở dữ liệu!'
            );
        }
    }

    async uploadLogoCompany(companyId:string, filename: string) {
        try {
            const company = await this.companyService.findById(companyId);

            if (company.logo) {
                await this.deleteImageFile(folderCompany, company.logo);
            }

            const updateCompany = await this.companyService.UpdatePartition(companyId, {logo: filename});
            return updateCompany.logo;
        } catch (error) {
            console.log("Lưu logo công ty không thành công do lỗi kết nối cơ sở dữ liệu!")
            throw new InternalServerErrorException(
                'Lưu logo công ty không thành công do lỗi kết nối cơ sở dữ liệu!'
            );
        }
    }

    async deleteImageCompany(companyId: string, filename: string) {
        try {
            const companyImage = await this.companyImageModel.findOne({companyId: companyId, filename: filename}).exec();

            if (companyImage) {
                await this.companyImageModel.deleteOne({companyId: companyId, filename: filename}).exec();
                await this.deleteImageFile(folderCompany, filename);
            }
            return companyImage;
        } catch (error) {
            console.log("Xóa ảnh công ty không thành công do lỗi kết nối cơ sở dữ liệu!")
            throw new InternalServerErrorException(
                'Xóa ảnh công ty không thành công do lỗi kết nối cơ sở dữ liệu!'
            );
        }
    }

    async deleteLogoCompany(companyId: string, filename: string) {
        try {
            const company = await this.companyService.UpdatePartition(companyId, { logo: ""});

            if (company) {
                await this.deleteImageFile(folderCompany, filename);
            }

            return company;
        } catch (error) {
            console.log("Xóa logo công ty không thành công do lỗi kết nối cơ sở dữ liệu!")
            throw new InternalServerErrorException(
                'Xóa logo công ty không thành công do lỗi kết nối cơ sở dữ liệu!'
            );
        }
    }

    // Candidate Image
    async getAvatarOfCandidateById(id: string) {
        try {
            const res = await this.candidateService.getAvatarOfCandidate(id);
            console.log("avatar of candidate: ", res)
            return res?.avatar;
        } catch (error) {
            console.log("Lấy avatar ứng viên không thành công do lỗi kết nối cơ sở dữ liệu!")
            throw new InternalServerErrorException(
                'Lấy avatar ứng viên không thành công do lỗi kết nối cơ sở dữ liệu!'
            );
        }
    }

    async getImagesOfCandidateById(id: string) {
        try {
            const res = await this.candidateImageModel.find({candidateId: id}).select('filename').exec();
            console.log("images of candidate: ", res)
            return res?.map((image) => image.filename);
        } catch (error) {
            console.log("Lấy ảnh ứng viên không thành công do lỗi kết nối cơ sở dữ liệu!")
            throw new InternalServerErrorException(
                'Lấy ảnh ứng viên không thành công do lỗi kết nối cơ sở dữ liệu!'
            );
        }
    }

    async uploadImageCandidate(candidateId: string, filename: string) {
        try {
            const candidateImage = new this.candidateImageModel({
                candidateId: candidateId,
                filename: filename,
            });
            return (await candidateImage.save()).filename;
        } catch (error) {
            console.log("Lưu ảnh ứng viên không thành công do lỗi kết nối cơ sở dữ liệu!")
            throw new InternalServerErrorException(
                'Lưu ảnh ứng viên không thành công do lỗi kết nối cơ sở dữ liệu!'
            );
        }
    }

    async uploadAvatarCandidate(candidateId:string, filename: string) {
        try {
            const data = await this.candidateService.getCandidateById(candidateId);

            if (data.avatar) {
                await this.deleteImageFile(folderCandidate, data.avatar);
            }

            const update = await this.candidateService.UpdatePartition(candidateId, {avatar: filename});
            return update?.avatar || "";
        } catch (error) {
            console.log("Lưu avatar ứng viên không thành công do lỗi kết nối cơ sở dữ liệu!")
            throw new InternalServerErrorException(
                'Lưu avatar ứng viên không thành công do lỗi kết nối cơ sở dữ liệu!'
            );
        }
    }

    async deleteImageCandidate(candidateId: string, filename: string) {
        try {
            const image = await this.candidateImageModel.findOne({candidateId: candidateId, filename: filename}).exec();

            if (image) {
                await this.candidateImageModel.deleteOne({candidateId: candidateId, filename: filename}).exec();
                await this.deleteImageFile(folderCandidate, filename);
            }
            return image;
        } catch (error) {
            console.log("Xóa ảnh ứng viên không thành công do lỗi kết nối cơ sở dữ liệu!")
            throw new InternalServerErrorException(
                'Xóa ảnh ứng viên không thành công do lỗi kết nối cơ sở dữ liệu!'
            );
        }
    }

    async deleteAvatarCandidate(candidateId: string, filename: string) {
        try {
            const data = await this.candidateService.UpdatePartition(candidateId, { avatar: ""});

            if (data) {
                await this.deleteImageFile(folderCandidate, filename);
            }

            return data;
        } catch (error) {
            console.log("Xóa avatar ứng viên không thành công do lỗi kết nối cơ sở dữ liệu!")
            throw new InternalServerErrorException(
                'Xóa avatar ứng viên không thành công do lỗi kết nối cơ sở dữ liệu!'
            );
        }
    }

    // <!------------------------- Resume ------------------------------------>
    async uploadResume(userId:string, filename: string) {
        try {
            const checkResumeExistByUserId = await this.resumeModel.findOne({userId: userId}).exec();
            if (checkResumeExistByUserId) {
                const data = await this.resumeModel.create({
                    userId: userId,
                    fileName: filename,
                    status: false
                })
                return data.fileName;
            } else {
                const data = await this.resumeModel.create({
                    userId: userId,
                    fileName: filename,
                    status: true
                })
                return data.fileName;
            }
        } catch (error) {
            console.log("Lưu resume ứng viên không thành công do lỗi kết nối cơ sở dữ liệu!")
            throw new InternalServerErrorException(
                'Lưu resume ứng viên không thành công do lỗi kết nối cơ sở dữ liệu!'
            );
        }
    }

    async deleteResume(resumeId: string, filename: string) {
        try {
            const image = await this.resumeModel.findOne({_id: resumeId}).exec();

            if (image) {
                await this.resumeModel.deleteOne({_id: resumeId}).exec();
                await this.deleteImageFile(folderResume, filename);
            }
            return image;
        } catch (error) {
            console.log("Xóa resume ứng viên không thành công do lỗi kết nối cơ sở dữ liệu!")
            throw new InternalServerErrorException(
                'Xóa resume ứng viên không thành công do lỗi kết nối cơ sở dữ liệu!'
            );
        }
    }

    // Function Helper
    async deleteImageFile(folder: string, filename: string): Promise<void> {
        try {
            const filePath = join(__dirname, '..', '..', 'images', folder, filename);
            await unlink(filePath);
            console.log(`✅ Đã xóa file ảnh: ${filename}`);
        } catch (error: any) {
            if (error.code === 'ENOENT') {
                console.warn(`⚠️ File không tồn tại: ${filename}`);
            } else {
                console.error(`❌ Lỗi khi xóa file: ${filename}`, error);
            }
        }
    }


}
