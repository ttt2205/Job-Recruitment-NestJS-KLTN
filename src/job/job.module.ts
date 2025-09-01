import { Module } from '@nestjs/common';
import { JobController } from './job.controller';
import { JobService } from './job.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Job, JobSchema } from './job.schema';
import { CompanyModule } from 'src/company/company.module';
import { FilterService } from './services/filter.service';
import { FilterServiceImpl } from './services/impl/filter.service.impl';

@Module({
  controllers: [JobController],
  providers: [
    JobService,
    {
      provide: FilterService,
      useClass: FilterServiceImpl
    }
  ],
  imports: [
    MongooseModule.forFeature([{ name: Job.name, schema: JobSchema }]),
    CompanyModule
  ],
  exports: [JobService]
})
export class JobModule {}
