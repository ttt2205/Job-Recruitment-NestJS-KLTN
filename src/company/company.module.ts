import { forwardRef, Module } from '@nestjs/common';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Company, CompanySchema } from './company.schema';
import { JobModule } from 'src/job/job.module';

@Module({
  controllers: [CompanyController],
  providers: [CompanyService],
  imports: [
    MongooseModule.forFeature([{ name: Company.name, schema: CompanySchema }]),
    forwardRef(() => JobModule)
  ],
  exports: [CompanyService]
})
export class CompanyModule {}
