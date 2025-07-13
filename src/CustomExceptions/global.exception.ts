import { HttpException, HttpStatus } from "@nestjs/common";

export class GlobalException extends HttpException {
    constructor(error: string, fieldName: string, fieldValue: string, statusCode: HttpStatus) {
        super({
            statusCode: statusCode,
            error: error,
            message: `${fieldName} ${fieldValue}`
        }, statusCode);
    }
}