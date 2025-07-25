import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class HashingProvider {
    abstract hashPassword(password: string | Buffer): Promise<string>;
    abstract comparePasswords(password: string | Buffer, hashedPassword: string | Buffer): Promise<boolean>;
}
