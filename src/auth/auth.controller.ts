import { Body, Controller, Get, Headers, HttpCode, HttpStatus, Post, UnauthorizedException, ValidationPipe } from '@nestjs/common';
import { LoginRequestDto } from './dtos/login-request.dto';
import { AuthService } from './auth.service';
import { CandidateResponseDto } from 'src/candidate/dtos/response/candidate-response.dto';
import { Candidate } from 'src/candidate/candidate.shema';
import { Company } from 'src/company/company.schema';
import { CompanyResponseDto } from 'src/company/dtos/response/company-response.dto';

@Controller('api/v1/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body(new ValidationPipe()) req: LoginRequestDto) {
        // Logic for user login
        const accessToken = await this.authService.login(req.email, req.password);
        return {
            statusCode: HttpStatus.OK,
            message: 'Login successful',
            data: {
                accessToken,
            },
        };
    }

    @Get('account')
    @HttpCode(HttpStatus.OK)
    async getAccount(@Headers('authorization') authHeader: string) {
        const token = this.extractToken(authHeader);
        console.log("token: ", token)
        // Logic for user login
        const res = await this.authService.getAccount(token);
        let responseDto = {};
        // Map data to dto and response for client
        if (res.type === 'candidate' && res.data) {
            const candidate = res.data as Candidate;
            responseDto = CandidateResponseDto.builder()
                .withId(candidate._id.toString())
                .withUserId(candidate.userId.toString())
                .withEmail(res.email)
                .withAvatar(candidate.avatar || '')
                .withName(candidate.name)
                .withAge(candidate.age || null)
                .withDesignation(candidate.designation || '')
                .withLocation(candidate.location || '')
                .withHourlyRate(candidate.hourlyRate || 0)
                .withTags(candidate.skills || [])
                .withCategory(candidate.industry || '')
                .withExperience(candidate.experience || 0)
                .withQualification(candidate.educationLevel || '')
                .withGender(candidate.gender || '')
                .withCreatedAt(candidate.createdAt)
                .withDescription(candidate.description || '')
                .withCurrentSalary(candidate.currentSalary || '')
                .withExpectSalary(candidate.expectSalary || '')
                .withLanguage(candidate.language || [])
                .withSocialMedias(candidate.socialMedias || [])
                .build();
        }

        if (res.type === 'company' && res.data) {
            const company = res.data as Company;
            responseDto = CompanyResponseDto.builder()
                .withId(company._id.toString())
                .withEmail(company.email)
                .withName(company.name)
                .withUserId(company.userId.toString())
                .withPrimaryIndustry(company.primaryIndustry)
                .withSize(company.size)
                .withFoundedIn(company.foundedIn)
                .withDescription(company.description)
                .withPhone(company.phone)
                .withAddress(company.address)
                .withLogo(company.logo)
                .withSocialMedias(company.socialMedias)
                .withCreatedBy(company.createdBy)
                .withUpdatedBy(company.updatedBy)
                .withDeletedBy(company.deletedBy)
                .build();
        }
        return {
            statusCode: HttpStatus.OK,
            message: 'Get account successful!',
            data: responseDto
                ? { userId: res.userId, emailLogin: res.email, type: res.type, ...responseDto }
                : { userId: res.userId, emailLogin: res.email, type: res.type },
        };
    }

    private extractToken(authHeader: string): string {
        if (!authHeader) throw new UnauthorizedException('Missing Authorization header');
        const [type, token] = authHeader.split(' ');
        if (type !== 'Bearer' || !token) throw new UnauthorizedException('Invalid Authorization header format');
        return token;
    }
}
