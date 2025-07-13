import { Module } from '@nestjs/common';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Company, CompanySchema } from './company.schema';

@Module({
  controllers: [CompanyController],
  providers: [CompanyService],
  imports: [
    MongooseModule.forFeature([{ name: Company.name, schema: CompanySchema }])
  ],
  exports: [CompanyService]
})
export class CompanyModule {}
