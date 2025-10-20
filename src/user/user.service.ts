import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';
import { PasswordUtil } from 'src/common/utils/password.utils';
import { UpdateUserDto } from './dtos/update-user.dto';
import { HashingProvider } from 'src/auth/provider/hashing.provider';
import { handleServiceError } from 'src/common/helpers/handle.service.error';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly hashingProvider: HashingProvider,
  ) {}

  async createUser(data: CreateUserDto): Promise<User> {
    try {
      const hashedPassword = await this.hashingProvider.hashPassword(
        data.password,
      );
      const createdUser = new this.userModel({
        ...data,
        password: hashedPassword,
        isActive: true,
        isDeleted: false,
      });
      return await createdUser.save();
    } catch (error) {
      handleServiceError(error, 'UserService.createUser');
    }
  }

  async findAll() {
    try {
      const listUser = await this.userModel.find({ isDeleted: false }).exec();
      return listUser;
    } catch (error) {
      handleServiceError(error, 'UserService.findAll');
    }
  }

  async UpdatePartition(id: string, data: UpdateUserDto): Promise<User> {
    try {
      const updated = await this.userModel.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true,
      });

      if (!updated) {
        throw new NotFoundException(`Không tìm thấy tài khoản với id: ${id}`);
      }

      return updated;
    } catch (error) {
      handleServiceError(error, 'UserService.UpdatePartition');
    }
  }

  async findByEmail(email: string) {
    try {
      const user = await this.userModel
        .findOne({ email, isDeleted: false })
        .exec();
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }
      return user;
    } catch (error) {
      handleServiceError(error, 'UserService.findByEmail');
    }
  }

  async findById(id: string) {
    try {
      const user = await this.userModel
        .findOne({ _id: id, isDeleted: false })
        .exec();
      if (!user) {
        throw new NotFoundException(`Không tìm thấy tài khoản với id: ${id}`);
      }
      return user;
    } catch (error) {
      handleServiceError(error, 'UserService.findById');
    }
  }
}
