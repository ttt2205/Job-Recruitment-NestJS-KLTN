import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { ServicePackageController } from 'src/service-package/service-package.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Notification, NotificationSchema } from './notification.schema';

@Module({
  controllers: [ServicePackageController, NotificationController],
  providers: [NotificationService],
  imports: [
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
    ]),
  ],
})
export class NotificationModule {}
