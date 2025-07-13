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

@Module({
  imports: [
    // 1️⃣ Đặt Mongoose cấu hình đầu tiên
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: 'mongodb://localhost:27017',
        dbName: 'job-recruitment',
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

