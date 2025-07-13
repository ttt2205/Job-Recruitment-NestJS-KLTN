import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';
import { PasswordUtil } from 'src/common/utils/password.utils';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {}

    async createUser(data: CreateUserDto): Promise<User> {
        try {
            const hashedPassword = await PasswordUtil.hashPassword(data.password);
            const createdUser = new this.userModel({
                ...data,
                password: hashedPassword,
                isActive: true,
                isDeleted: false
            });
            return await createdUser.save();
        } catch (error) {
            // Xử lý lỗi duplicate key hoặc validation
            if (error.code === 11000) {
                throw new ConflictException('Email already exists');
            }
            throw new BadRequestException(error.message);
        }
    }

    async findAll() {
        try {
            const listUser = await this.userModel.find({isDeleted: false}).exec();
            return listUser;
        } catch (error) {
            throw new BadRequestException(error.message)
        }
    }
}
