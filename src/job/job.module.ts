import { Module } from '@nestjs/common';
import { JobController } from './job.controller';
import { JobService } from './job.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Job, JobSchema } from './job.schema';
import { CompanyModule } from 'src/company/company.module';

@Module({
  controllers: [JobController],
  providers: [JobService],
  imports: [
    MongooseModule.forFeature([{ name: Job.name, schema: JobSchema }]),
    CompanyModule
  ]
})
export class JobModule {}
