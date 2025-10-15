import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true, // Tự động chuyển đổi kiểu cho dữ liệu đầu vào từ url
      },
    }),
  );

  app.use(cookieParser()); // bắt buộc nếu muốn có req.cookies

  app.enableCors({
    origin: 'http://localhost:3001',
    credentials: true, // 👈 cho phép gửi cookie
  });

  app.useStaticAssets(join(process.cwd(), 'images'), {
    prefix: '/images',
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
