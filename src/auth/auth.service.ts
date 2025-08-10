import { forwardRef, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
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

@Injectable()
export class AuthService {
    constructor (
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
        // Validate user credentials
        const user = await this.userService.findByEmail(email);

        const equalPassword = await this.hashingProvider.comparePasswords(password, user.password);

        if (!user || !equalPassword) {
            throw new Error('Invalid credentials');
        }

        const accessToken = this.jwtService.signAsync({
            sub: user._id,
            email: email,
            type: user.type
        }, {
            secret: this.authConfiguration.secret,
            expiresIn: this.authConfiguration.expiresIn,
            audience: this.authConfiguration.audience,
            issuer: this.authConfiguration.issuer, 
        });

        return accessToken;
    }

    async getAccount(token: string): Promise<{
        userId: string;
        email: string;
        type: 'candidate' | 'company' | 'admin';
        data: Company | Candidate | null
    }> {
        try {
            // payload sẽ có cấu trúc giống như khi bạn sign: { sub, email, type }
            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.authConfiguration.secret,
                audience: this.authConfiguration.audience,
                issuer: this.authConfiguration.issuer,
            });

            const id = payload.sub;
            const email = payload.email;
            const type = payload.type;

            let data: Company | Candidate | null = null;

            if (type === 'candidate') {
                data = await this.candidateService.getCandidateByUseIdNullable(id);
            } else if (type === 'company') {
                data = await this.companyService.getCompanyByUseIdNullable(id);
            } else {
                throw new Error(`Unsupported user type: ${type}`);
            }

            return {
                userId: id,
                email,
                type,
                data,
            };

            
        } catch (error) {
            if (error instanceof TokenExpiredError) {
                throw new UnauthorizedException('Token has expired');
            }

            if (error instanceof JsonWebTokenError) {
                throw new UnauthorizedException('Invalid token');
            }

            console.log("getAccount error: ", error)
            throw error;
        }
    }
}
