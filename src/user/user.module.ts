import { forwardRef, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';
import { AuthModule } from 'src/auth/auth.module';
import { CandidateModule } from 'src/candidate/candidate.module';
import { CompanyModule } from 'src/company/company.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    forwardRef(() => AuthModule),
    forwardRef(() => CandidateModule),
    forwardRef(() => CompanyModule),
  ],
  exports: [UserService],
})
export class UserModule {}
