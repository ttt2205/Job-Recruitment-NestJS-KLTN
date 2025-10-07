import { Module } from '@nestjs/common';
import { ApplicationController } from './application.controller';
import { ApplicationService } from './application.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Application, ApplicationSchema } from './application.schema';

@Module({
  controllers: [ApplicationController],
  providers: [ApplicationService],
  imports: [
    MongooseModule.forFeature([
      { name: Application.name, schema: ApplicationSchema },
    ]),
  ],
  exports: [ApplicationService],
})
export class ApplicationModule {}
