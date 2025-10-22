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
import { CandidateService } from 'src/candidate/candidate.service';
import { CompanyService } from 'src/company/company.service';
import { CreateCandidateDto } from 'src/candidate/dtos/create-candidate.dto';
import { CreateCompanyDto } from 'src/company/dtos/create-company.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly hashingProvider: HashingProvider,
    private readonly candidateService: CandidateService,
    private readonly companyService: CompanyService,
  ) {}

  async createUser(data: CreateUserDto): Promise<User> {
    try {
      // 0️⃣ Kiểm tra email đã tồn tại chưa
      const existingUser = await this.userModel
        .findOne({ email: data.email, isDeleted: false })
        .exec();
      if (existingUser) {
        throw new ConflictException('Email đã tồn tại');
      }

      const hashedPassword = await this.hashingProvider.hashPassword(
        data.password,
      );
      // 1️⃣ Tạo user mới
      const createdUser = new this.userModel({
        ...data,
        password: hashedPassword,
        status: true,
        isDeleted: false,
      });

      // 2️⃣ Lưu vào database
      const savedUser = await createdUser.save();

      // 3️⃣ Kiểm tra type để xử lý thêm
      switch (savedUser.type) {
        case 'candidate': {
          const emptyCandidateProfile: CreateCandidateDto = {
            userId: savedUser._id.toString(), // ID người dùng mới tạo
            name: '', // để ứng viên cập nhật sau
            birthday: undefined,
            phone: '',
            industry: '',
            skills: [],
            avatar: '',
            designation: '',
            country: '',
            city: '',
            location: '',
            hourlyRate: undefined,
            description: '',
            experience: '',
            currentSalary: '',
            expectedSalary: '',
            gender: '',
            language: [],
            educationLevel: '',
            socialMedias: [],
          };
          await this.candidateService.createNewCandidate(emptyCandidateProfile);
          break;
        }

        case 'company': {
          const emptyCompanyProfile: CreateCompanyDto = {
            userId: savedUser._id.toString(),
            email: '', // sẽ lấy từ user hoặc để trống
            name: 'Chưa cập nhật',
            primaryIndustry: 'Chưa cập nhật',
            size: '',
            foundedIn: undefined,
            description: '',
            phone: '',
            country: '',
            city: '',
            address: '',
            logo: '',
            website: '',
            socialMedias: [],
          };
          await this.companyService.createNewCompany(emptyCompanyProfile);
          break;
        }

        default:
          throw new BadRequestException('Loại tài khoản không hợp lệ.');
      }

      // 4️⃣ Trả kết quả
      return savedUser;
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
