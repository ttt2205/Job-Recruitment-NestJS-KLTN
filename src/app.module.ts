import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ResumeModule } from './resume/resume.module';
import { JobModule } from './job/job.module';
import { CompanyModule } from './company/company.module';
import { PermissionModule } from './permission/permission.module';
import { RoleModule } from './role/role.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CandidateModule } from './candidate/candidate.module';
import { CandidateAboutModule } from './candidate-about/candidate-about.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UploadModule } from './upload/upload.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ApplicationModule } from './application/application.module';
import { ServicePackageModule } from './service-package/service-package.module';
import { SubcriptionModule } from './subcription/subcription.module';
import { BlogModule } from './blog/blog.module';
import { NotificationModule } from './notification/notification.module';
import authConfig from './auth/config/auth.config';

const ENV = process.env.NODE_ENV;
const envFilePath = !ENV ? `.env` : `.env.${ENV}`;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Biến môi trường có thể sử dụng toàn cục
      envFilePath,
      load: [authConfig]
    }),

    // 1️⃣ Đặt Mongoose cấu hình đầu tiên
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
        dbName: configService.get<string>('MONGO_DB_NAME'),
      }),
    }),

    // 2️⃣ Các module phụ thuộc Mongo đặt sau
    ResumeModule,
    JobModule,
    CompanyModule,
    PermissionModule,
    RoleModule,
    UserModule,
    AuthModule,
    CandidateModule,
    CandidateAboutModule,
    UploadModule,
    ApplicationModule,
    ServicePackageModule,
    SubcriptionModule,
    BlogModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

