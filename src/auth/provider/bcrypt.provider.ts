import { Injectable } from '@nestjs/common';
import { HashingProvider } from './hashing.provider.js';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptProvider implements HashingProvider {
    async hashPassword(password: string | Buffer): Promise<string> {
        // Generate a salt
        const salt = await bcrypt.genSalt(10);

        // Hash the password with the salt
        const hashedPassword = await bcrypt.hash(password.toString(), salt);
        return hashedPassword;
    }

    async comparePasswords(password: string | Buffer, hashedPassword: string | Buffer): Promise<boolean> {
        // Implement bcrypt comparison logic here
        return bcrypt.compare(password.toString(), hashedPassword.toString());
    }
}
