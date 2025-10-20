import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Post,
  Req,
  Res,
  UnauthorizedException,
  ValidationPipe,
} from '@nestjs/common';
import { LoginRequestDto } from './dtos/requests/login-request.dto';
import { AuthService } from './auth.service';
import { CandidateResponseDto } from 'src/candidate/dtos/response/candidate-response.dto';
import { Candidate } from 'src/candidate/candidate.shema';
import { Company } from 'src/company/company.schema';
import { CompanyResponseDto } from 'src/company/dtos/response/company-response.dto';
import { Response, Request } from 'express';
import { handleServiceError } from 'src/common/helpers/handle.service.error';
import { RegisterRequestDto } from './dtos/requests/register.request.dto';
import { UserResponseDto } from 'src/user/dtos/responses/user.response.dto';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async Login(
    @Body(new ValidationPipe()) req: LoginRequestDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    // Logic for user login
    const accessToken = await this.authService.login(req.email, req.password);

    const maxAge = process.env.JWT_TOKEN_EXPIRATION
      ? this.authService.parseExpirationToMs(process.env.JWT_TOKEN_EXPIRATION)
      : 3600000; // mặc định 1h

    // 👇 set cookie HttpOnly
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // false cho localhost
      sameSite: 'lax',
      path: '/',
      maxAge,
    });

    return {
      success: true,
      statusCode: HttpStatus.OK,
      message: 'Login successful',
    };
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async Register(@Body(new ValidationPipe()) req: RegisterRequestDto) {
    // Logic for user registration
    const user = await this.authService.registerAccount(
      req.email,
      req.password,
      req.type,
    );
    const userDto = UserResponseDto.builder()
      .withId(user._id.toString())
      .withEmail(user.email)
      .withType(user.type)
      .withStatus(user.status)
      .withCreatedAt(user.createdAt)
      .withUpdatedAt(user.updatedAt)
      .build();
    return {
      success: true,
      statusCode: HttpStatus.CREATED,
      message: 'Register successful',
      data: userDto || {},
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Res({ passthrough: true }) res: Response) {
    try {
      // Kiểm tra cookie có tồn tại không
      const cookies = res.req.cookies;
      if (!cookies || !cookies.accessToken) {
        throw new InternalServerErrorException('Không tìm thấy cookie để xóa');
      }

      // Xóa cookie accessToken
      res.clearCookie('accessToken', {
        httpOnly: true,
        secure: true, // true nếu dùng https
        sameSite: 'lax',
        path: '/',
      });

      return {
        success: true,
        statusCode: HttpStatus.OK,
        message: 'Đăng xuất thành công',
      };
    } catch (error) {
      handleServiceError(error, 'AuthController.logout');
    }
  }

  @Get('account')
  @HttpCode(HttpStatus.OK)
  async getAccount(@Req() req: Request) {
    const token = req.cookies['accessToken'];
    console.log('token: ', token);
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
        .build();
    }

    if (res.type === 'company' && res.data) {
      const company = res.data as Company;
      responseDto = CompanyResponseDto.builder()
        .withId(company._id.toString())
        .withEmail(company.email)
        .withLogo(company.logo || '')
        .withName(company.name)
        .withUserId(company.userId.toString())
        .withPrimaryIndustry(company.primaryIndustry)
        .build();
    }
    return {
      statusCode: HttpStatus.OK,
      message: 'Get account successful!',
      data: responseDto
        ? {
            userId: res.userId,
            emailLogin: res.email,
            type: res.type,
            ...responseDto,
          }
        : { userId: res.userId, emailLogin: res.email, type: res.type },
    };
  }

  private extractToken(authHeader: string): string {
    if (!authHeader)
      throw new UnauthorizedException('Missing Authorization header');
    const [type, token] = authHeader.split(' ');
    if (type !== 'Bearer' || !token)
      throw new UnauthorizedException('Invalid Authorization header format');
    return token;
  }
}
