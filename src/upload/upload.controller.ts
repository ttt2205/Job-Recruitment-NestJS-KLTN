import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UploadService } from './upload.service';

@Controller('api/v1/upload')
export class UploadController {
    constructor(private readonly uploadService: UploadService) {}

    // <-- Upload company logo and images !-->
    @Get('logo/company/:id')
    @HttpCode(HttpStatus.OK)
    async getLogoOfComanyById(@Param('id') id: string) {
        const res = await this.uploadService.getLogoOfCompanyById(id);
        return {
            statusCode: HttpStatus.OK,
            message: "Lấy logo công ty thành công!",
            data: res || ""
        };
    }

    @Get('images/company/:id')
    @HttpCode(HttpStatus.OK)
    async getImagesOfComanyById(@Param('id') id: string) {
        const res = await this.uploadService.getImagesOfCompanyById(id);
        return {
            statusCode: HttpStatus.OK,
            message: "Lấy ảnh công ty thành công!",
            results: res || []
        };
    }

    @Post('image/company/:companyId')
    @HttpCode(HttpStatus.OK)
    @UseInterceptors(
        FileInterceptor('file', {
        storage: diskStorage({
            destination: './images/companies', // vị trí thư mục lưu ảnh được lưu trên ổ đĩa
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const ext = extname(file.originalname);
                cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
            },
        }),
        }),
    )
    async uploadCompanyImageFile(@Param('companyId') companyId:string, @UploadedFile() file: Express.Multer.File) {
        const filename = file.filename; // ✅ tên file đã chỉnh sửa
        const res = await this.uploadService.uploadImageCompany(companyId, filename);
        return {
            statusCode: HttpStatus.OK,
            message: "Upload ảnh công ty thành công!",
            data: res || ""
        };
    }

    @Post('logo/company/:companyId')
    @HttpCode(HttpStatus.OK)
    @UseInterceptors(
        FileInterceptor('file', {
        storage: diskStorage({
            destination: './images/companies', // vị trí thư mục lưu ảnh được lưu trên ổ đĩa
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const ext = extname(file.originalname);
                cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
            },
        }),
        }),
    )
    async uploadCompanyLogoFile(@Param('companyId') companyId:string, @UploadedFile() file: Express.Multer.File) {
        const filename = file.filename; // ✅ tên file đã chỉnh sửa
        const res = await this.uploadService.uploadLogoCompany(companyId, filename);
        return {
            statusCode: HttpStatus.OK,
            message: "Upload logo công ty thành công!",
            data: res || ""
        };
    }

    @Delete('image/company/:id')
    @HttpCode(HttpStatus.OK)
    async deleteImageCompany(
        @Param('id') id: string,
        @Body('filename') filename: string
    ) {
        const res = await this.uploadService.deleteImageCompany(id, filename);
        return {
            statusCode: HttpStatus.OK,
            message: "Xóa ảnh công ty thành công!",
            data: res || {}
        };
    }

    @Delete('logo/company/:id')
    @HttpCode(HttpStatus.OK)
    async deleteLogoCompany(
        @Param('id') id: string,
        @Body('filename') filename: string
    ) {
        console.log("filename: ", filename)
        const res = await this.uploadService.deleteLogoCompany(id, filename);
        return {
            statusCode: HttpStatus.OK,
            message: "Xóa logo công ty thành công!",
            data: res || {}
        };
    }

    // <-- Upload candidate avatar and images !-->
    @Get('avatar/candidate/:id')
    @HttpCode(HttpStatus.OK)
    async getAvatarOfCandidateById(@Param('id') id: string) {
        const res = await this.uploadService.getAvatarOfCandidateById(id);
        return {
            statusCode: HttpStatus.OK,
            message: "Lấy avatar ứng viên thành công!",
            data: res || ""
        };
    }

    @Get('images/candidate/:id')
    @HttpCode(HttpStatus.OK)
    async getImagesOfCandidateById(@Param('id') id: string) {
        const res = await this.uploadService.getImagesOfCandidateById(id);
        return {
            statusCode: HttpStatus.OK,
            message: "Lấy avatar ứng viên thành công!",
            results: res || []
        };
    }

    @Post('image/candidate/:id')
    @HttpCode(HttpStatus.OK)
    @UseInterceptors(
        FileInterceptor('file', {
        storage: diskStorage({
            destination: './images/candidates', // vị trí thư mục lưu ảnh được lưu trên ổ đĩa
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const ext = extname(file.originalname);
                cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
            },
        }),
        }),
    )
    async uploadCandidateImageFile(@Param('id') id:string, @UploadedFile() file: Express.Multer.File) {
        const filename = file.filename; // ✅ tên file đã chỉnh sửa
        const res = await this.uploadService.uploadImageCandidate(id, filename);
        return {
            statusCode: HttpStatus.OK,
            message: "Upload ảnh ứng viên thành công!",
            data: res || ""
        };
    }

    @Post('avatar/candidate/:id')
    @HttpCode(HttpStatus.OK)
    @UseInterceptors(
        FileInterceptor('file', {
        storage: diskStorage({
            destination: './images/candidates', // vị trí thư mục lưu ảnh được lưu trên ổ đĩa
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                const ext = extname(file.originalname);
                cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
            },
        }),
        }),
    )
    async uploadCandidateAvatarFile(@Param('id') id:string, @UploadedFile() file: Express.Multer.File) {
        const filename = file.filename; // ✅ tên file đã chỉnh sửa
        const res = await this.uploadService.uploadAvatarCandidate(id, filename);
        return {
            statusCode: HttpStatus.OK,
            message: "Upload avatar ứng viên thành công!",
            data: res || ""
        };
    }

    @Delete('image/candidate/:id')
    @HttpCode(HttpStatus.OK)
    async deleteImageCandidate(
        @Param('id') id: string,
        @Body('filename') filename: string
    ) {
        const res = await this.uploadService.deleteImageCandidate(id, filename);
        return {
            statusCode: HttpStatus.OK,
            message: "Xóa ảnh ứng viên thành công!",
            data: res || {}
        };
    }

    @Delete('avatar/candidate/:id')
    @HttpCode(HttpStatus.OK)
    async deleteAvatarCandidate(
        @Param('id') id: string,
        @Body('filename') filename: string
    ) {
        console.log("filename: ", filename)
        const res = await this.uploadService.deleteAvatarCandidate(id, filename);
        return {
            statusCode: HttpStatus.OK,
            message: "Xóa avatar ứng viên thành công!",
            data: res || {}
        };
    }
}
