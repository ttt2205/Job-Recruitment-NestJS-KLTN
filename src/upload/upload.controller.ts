import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('upload')
export class UploadController {

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
    uploadCandidateImageFile(@UploadedFile() file: Express.Multer.File) {
        return {
        url: `/images/candidates/${file.filename}`,
        originalname: file.originalname,
        };
    }

    @Post('image/company')
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
    uploadCompanyImageFile(@UploadedFile() file: Express.Multer.File) {
        return {
        url: `/images/companies/${file.filename}`,
        originalname: file.originalname,
        };
    }
}
