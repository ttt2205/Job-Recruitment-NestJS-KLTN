import { Module } from '@nestjs/common';
import { ServicePackageService } from './service-package.service';
import { ServicePackageController } from './service-package.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ServicePackage, ServicePackageSchema } from './service-package.schema';

@Module({
  controllers: [ServicePackageController, ServicePackageController],
  providers: [ServicePackageService],
  imports: [
    MongooseModule.forFeature([
      { name: ServicePackage.name, schema: ServicePackageSchema },
    ]),
  ],
})
export class ServicePackageModule {}
