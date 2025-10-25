import {
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import authConfig from './config/auth.config';
import { ConfigType } from '@nestjs/config';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import { HashingProvider } from './provider/hashing.provider';
import { ConfigService } from '@nestjs/config';
import { CandidateService } from 'src/candidate/candidate.service';
import { CompanyService } from 'src/company/company.service';
import { CandidateResponseDto } from 'src/candidate/dtos/response/candidate-response.dto';
import { Company } from 'src/company/company.schema';
import { Candidate } from 'src/candidate/candidate.shema';
import { handleServiceError } from 'src/common/helpers/handle.service.error';
@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,

    @Inject(authConfig.KEY)
    private readonly authConfiguration: ConfigType<typeof authConfig>,

    private readonly hashingProvider: HashingProvider,

    private readonly jwtService: JwtService,

    private readonly candidateService: CandidateService,

    private readonly companyService: CompanyService,
  ) {}

  async login(email: string, password: string) {
    try {
      // Validate user credentials
      const user = await this.userService.findByEmail(email);

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const equalPassword = await this.hashingProvider.comparePasswords(
        password,
        user.password,
      );

      if (!equalPassword) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const accessToken = await this.jwtService.signAsync(
        {
          sub: user._id,
          email: email,
          role: user.role,
        },
        {
          secret: this.authConfiguration.secret,
          expiresIn: this.authConfiguration.expiresIn,
          audience: this.authConfiguration.audience,
          issuer: this.authConfiguration.issuer,
        },
      );

      return accessToken;
    } catch (error) {
      handleServiceError(error, 'AuthService.login');
    }
  }

  async getAccount(token: string): Promise<{
    userId: string;
    email: string;
    role: 'candidate' | 'employer' | 'admin';
    data: Company | Candidate | null;
  }> {
    try {
      // payload sẽ có cấu trúc giống như khi bạn sign: { sub, email, role }
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.authConfiguration.secret,
        audience: this.authConfiguration.audience,
        issuer: this.authConfiguration.issuer,
      });

      const id = payload.sub;
      const email = payload.email;
      const role = payload.role;

      let data: Company | Candidate | null = null;

      console.log('process.env.ROLE_CANDIDATE: ', process.env.ROLE_CANDIDATE);
      if (role === process.env.ROLE_CANDIDATE) {
        data = await this.candidateService.getCandidateByUserIdNullable(id);
      } else if (role === process.env.ROLE_EMPLOYER) {
        data = await this.companyService.getCompanyByUserIdNullable(id);
      } else {
        throw new Error(`Unsupported user role: ${role}`);
      }

      return {
        userId: id,
        email,
        role,
        data,
      };
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('Token has expired');
      }

      if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedException('Invalid token');
      }

      handleServiceError(error, 'AuthService.getAccount');
    }
  }

  async registerAccount(email: string, password: string, role: string) {
    try {
      const createdUser = await this.userService.createUser({
        email,
        password,
        role,
      });
      return createdUser;
    } catch (error) {
      handleServiceError(error, 'AuthService.registerAccount');
    }
  }

  parseExpirationToMs(exp: string): number {
    const match = /^(\d+)([smhd])$/.exec(exp);
    if (!match) throw new Error(`Invalid expiration format: ${exp}`);

    const value = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
      case 's':
        return value * 1000;
      case 'm':
        return value * 60 * 1000;
      case 'h':
        return value * 60 * 60 * 1000;
      case 'd':
        return value * 24 * 60 * 60 * 1000;
      default:
        throw new Error(`Unknown time unit: ${unit}`);
    }
  }
}
