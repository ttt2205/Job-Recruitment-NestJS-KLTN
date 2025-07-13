import { Body, Controller, Get, Post, ValidationPipe } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserService } from './user.service';

@Controller('api/v1/user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    async getListUser() {
        return await this.userService.findAll();
    }

    @Post()
    async createUser(@Body(new ValidationPipe()) data: CreateUserDto) {
        const newUser = await this.userService.createUser(data);
        console.log("tao user thanh cong!")
        return newUser;
    }
}
