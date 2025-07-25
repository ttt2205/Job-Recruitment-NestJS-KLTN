import { BadRequestException, ConflictException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';
import { PasswordUtil } from 'src/common/utils/password.utils';
import { UpdateUserDto } from './dtos/update-user.dto';
import { HashingProvider } from 'src/auth/provider/hashing.provider';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        private readonly hashingProvider: HashingProvider
    ) {}

    async createUser(data: CreateUserDto): Promise<User> {
        try {
            const hashedPassword = await this.hashingProvider.hashPassword(data.password);
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

    async UpdatePartition(id: string, data: UpdateUserDto):Promise<User> {
        try {
            const updated = await this.userModel.findByIdAndUpdate(id, data, {
                new: true,
                runValidators: true,
            })

            if (!updated) {
                throw new NotFoundException(`Không tìm thấy tài khoản với id: ${id}`)
            }

            return updated;
        } catch (error) {
            // Nếu lỗi đã là HttpException (gồm cả GlobalException) thì ném lại
            if (error instanceof HttpException) {
                throw error;
            }

            console.error('Lỗi cập nhật tài khoản:', error.message);
            throw new InternalServerErrorException(
                'Không thể cập nhật tài khoản vì lỗi kết nối cơ sở dữ liệu'
            );
        }
    }

    async findByEmail(email: string) {
        try {
            const user = await this.userModel.findOne({ email, isDeleted: false }).exec();
            if (!user) {
                throw new NotFoundException(`Không tìm thấy tài khoản với email: ${email}`);
            }
            return user;
        } catch (error) {
            throw new InternalServerErrorException(
                'Không thể tìm thấy tài khoản vì lỗi kết nối cơ sở dữ liệu'
            );
        }
    }
}
