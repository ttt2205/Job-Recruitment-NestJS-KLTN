import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CandidateImage } from './candidate-images.shema';
import { Model } from 'mongoose';
import { CompanyImage } from './company-images.schema';

@Injectable()
export class UploadService {
    constructor(
        // Initialization logic if needed
        @InjectModel(CandidateImage.name) private candidateImageModel: Model<CandidateImage>,
        @InjectModel(CompanyImage.name) private companyImageModel: Model<CompanyImage>
    ) {}

    
}
