import * as bcrypt from 'bcrypt';

export class PasswordUtil {
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 10; // Số vòng salt (càng cao càng an toàn nhưng chậm)
    return bcrypt.hash(password, saltRounds);
  }

  static async comparePassword(
    plainText: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainText, hashedPassword);
  }
}