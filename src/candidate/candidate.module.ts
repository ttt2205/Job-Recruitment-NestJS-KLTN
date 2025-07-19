import { Module } from '@nestjs/common';
import { CandidateService } from './candidate.service';
import { CandidateController } from './candidate.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Candidate, CandidateSchema } from './candidate.shema';
import { CandidateAboutModule } from 'src/candidate-about/candidate-about.module';

@Module({
  providers: [CandidateService],
  controllers: [CandidateController],
  imports: [
    MongooseModule.forFeature([{ name: Candidate.name, schema: CandidateSchema }]),
    CandidateAboutModule // Importing CandidateAboutModule to use its services
  ]
})
export class CandidateModule {}
