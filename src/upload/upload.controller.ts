import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { UploadService } from './upload.service';

@Controller('api/v1/upload')
export class UploadController {
    constructor(private readonly uploadService: UploadService) {}

    @Post('image/candidate')
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
    async uploadCandidateImageFile(@UploadedFile() file: Express.Multer.File) {
        const filename = file.filename; // ✅ tên file đã chỉnh sửa
        const originalname = file.originalname;

        return {
            url: `/images/companies/${filename}`,
            originalname,
        };
    }

    @Get('image/company/:id')
    @HttpCode(HttpStatus.OK)
    async getImagesOfComanyById(@Param('id') id: string) {
        const res = await this.uploadService.getImagesOfCompanyById(id);
        return {
            statusCode: HttpStatus.OK,
            message: "Lấy ảnh công ty thành công!",
            data: res || []
        };
    }

    @Post('image/company')
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
    async uploadCompanyImageFile(@UploadedFile() file: Express.Multer.File) {
        const filename = file.filename; // ✅ tên file đã chỉnh sửa
        const res = await this.uploadService.uploadImageCompany(filename);
        return {
            statusCode: HttpStatus.OK,
            message: "Upload ảnh công ty thành công!",
            data: res || {}
        };
    }

    @Post('logo/company')
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
    async uploadCompanyLogoFile(@UploadedFile() file: Express.Multer.File) {
        const filename = file.filename; // ✅ tên file đã chỉnh sửa
        const res = await this.uploadService.uploadLogoCompany(filename);
        return {
            statusCode: HttpStatus.OK,
            message: "Upload logo công ty thành công!",
            data: res || {}
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
        const res = await this.uploadService.deleteImageCompany(id, filename);
        return {
            statusCode: HttpStatus.OK,
            message: "Xóa logo công ty thành công!",
            data: res || {}
        };
    }
}
