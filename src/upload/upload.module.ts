import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CandidateImage, CandidateImageSchema } from './candidate-images.shema';
import { CompanyImage, CompanyImageSchema } from './company-images.schema';

@Module({
  controllers: [UploadController],
  providers: [UploadService],
  imports: [
    MongooseModule.forFeature([
        { name: CandidateImage.name, schema: CandidateImageSchema },
        { name: CompanyImage.name, schema: CompanyImageSchema },
    ]),
  ]
})
export class UploadModule {}
