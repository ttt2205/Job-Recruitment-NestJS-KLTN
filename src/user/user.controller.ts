import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, ValidationPipe } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserService } from './user.service';
import { UpdateUserDto } from './dtos/update-user.dto';

@Controller('api/v1/user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    async getListUser() {
        return await this.userService.findAll();
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createUser(@Body(new ValidationPipe()) data: CreateUserDto) {
        const newUser = await this.userService.createUser(data);
        return {
            statusCode: HttpStatus.CREATED,
            message: "Tạo tài khoản thành công!",
            data: newUser || {},
        }
    }

    @Patch(':id')
    @HttpCode(HttpStatus.OK)
    async updatePartitionUser(@Param('id') id: string, @Body() data: UpdateUserDto) {
        const update = await this.userService.UpdatePartition(id, data);
        return {
            statusCode: HttpStatus.CREATED,
            message: "Cập nhật hồ sơ tài khoản thành công!",
            data: update || {},
        }
    }  
}
