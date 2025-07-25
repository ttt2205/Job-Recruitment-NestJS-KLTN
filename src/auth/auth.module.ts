import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { CandidateModule } from 'src/candidate/candidate.module';
import { CompanyModule } from 'src/company/company.module';
import authConfig from './config/auth.config';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { BcryptProvider } from './provider/bcrypt.provider';
import { HashingProvider } from './provider/hashing.provider.js';

@Module({
  controllers: [AuthController],
  providers: [AuthService, {
    provide: HashingProvider,
    useClass: BcryptProvider, // Using BcryptProviderTs as the implementation of HashingProviderTs
  }],
  imports: [
    forwardRef(() => UserModule),
    CandidateModule,
    CompanyModule,
    ConfigModule.forFeature(authConfig), // Importing the auth configuration
    JwtModule.registerAsync(authConfig.asProvider()), // Registering JWT module with async configuration
  ],
  exports: [AuthService, HashingProvider], // Exporting AuthService for use in other modules
})
export class AuthModule {}
