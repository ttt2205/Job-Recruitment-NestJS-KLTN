import { forwardRef, Module } from '@nestjs/common';
import { ApplicationController } from './application.controller';
import { ApplicationService } from './application.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Application, ApplicationSchema } from './application.schema';
import { JobModule } from 'src/job/job.module';
import { CandidateModule } from 'src/candidate/candidate.module';
import { ResumeModule } from 'src/resume/resume.module';
import { CompanyModule } from 'src/company/company.module';

@Module({
  controllers: [ApplicationController],
  providers: [ApplicationService],
  imports: [
    MongooseModule.forFeature([
      { name: Application.name, schema: ApplicationSchema },
    ]),
    JobModule,
    forwardRef(() => CandidateModule),
    forwardRef(() => ResumeModule),
    JobModule,
    CompanyModule,
  ],
  exports: [ApplicationService],
})
export class ApplicationModule {}
