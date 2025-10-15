import {
  HttpException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

export function handleServiceError(error: any, context: string = ''): never {
  const logger = new Logger('ServiceError');

  // Ghi log chi tiết lỗi
  logger.error(`[${context}] ${error.message}`, error.stack);

  // Nếu lỗi đã là HttpException (ví dụ NotFoundException, BadRequestException) thì ném lại luôn
  if (error instanceof HttpException) {
    throw error;
  }

  // Ngược lại, trả về lỗi hệ thống chung
  throw new InternalServerErrorException(
    'Đã xảy ra lỗi trong quá trình xử lý yêu cầu',
  );
}
