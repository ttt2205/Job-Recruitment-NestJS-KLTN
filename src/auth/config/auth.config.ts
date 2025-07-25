import { registerAs } from "@nestjs/config";

export default registerAs('auth', () => ({
    secret: process.env.JWT_SECRET || "your_jwt_secret_key_temp",
    expiresIn: process.env.JWT_TOKEN_EXPIRATION ?? '3600', // Default to 1 hour if not set
    audience: process.env.JWT_AUDIENCE || 'localhost:3000',
    issuer: process.env.JWT_ISSUER || 'localhost:3000',
}));