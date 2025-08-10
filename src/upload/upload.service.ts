import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CandidateImage } from './candidate-images.shema';
import { Model } from 'mongoose';
import { CompanyImage } from './company-images.schema';
import { CompanyService } from 'src/company/company.service';
import { join } from 'path';
import { unlink } from 'fs/promises';
import { combineAll } from 'rxjs';

const folderCompany = 'companies';
const folderCandidate = 'candidates';
@Injectable()
export class UploadService {
    constructor(
        // Initialization logic if needed
        @InjectModel(CandidateImage.name) private candidateImageModel: Model<CandidateImage>,
        @InjectModel(CompanyImage.name) private companyImageModel: Model<CompanyImage>,
        private readonly companyService: CompanyService
    ) {}

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
