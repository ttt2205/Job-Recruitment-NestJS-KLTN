import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true, // Tự động chuyển đổi kiểu cho dữ liệu đầu vào từ url
    }
  }))
  app.enableCors({
    origin: 'http://localhost:3001',
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
