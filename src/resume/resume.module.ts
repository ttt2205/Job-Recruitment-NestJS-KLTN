import { Module } from '@nestjs/common';
import { ResumeController } from './resume.controller';
import { ResumeService } from './resume.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Resume, ResumeSchema } from './resume.schema';
import { CandidateModule } from 'src/candidate/candidate.module';

@Module({
  controllers: [ResumeController],
  providers: [ResumeService],
  imports: [
      MongooseModule.forFeature([{ name: Resume.name, schema: ResumeSchema }]),
      CandidateModule
    ],
  exports: [ResumeService, MongooseModule]
})
export class ResumeModule {}
