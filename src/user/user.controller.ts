import { Body, Controller, Delete, Get, Param, Post, Res } from '@nestjs/common';
// import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';
import { User } from './domain/user.entity';
import { UserSaveRequestDto, UserSaveResponseDto } from './dto/saveUser.dto';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {
        this.userService = userService;
    }

    @Get('list')
    async findAll(): Promise<User[]> {
        const userList = await this.userService.findAll();
        return Object.assign({
            data: userList,
            statusCode: 200,
            statusMsg: `데이터 조회가 성공적으로 완료되었습니다.`,
        });
    }

    @Get(':userId')
    async findOne(@Param('userId') id: string): Promise<User> {
        const foundUser = await this.userService.findOne(id);
        return Object.assign({
            data: foundUser,
            statusCode: 200,
            statusMsg: `데이터 조회가 성공적으로 완료되었습니다.`,
        });
    }

    @Post('save')
    async saveUser(@Body() saveRequestDto: UserSaveRequestDto): Promise<string> {
        console.log(saveRequestDto);

        const user = UserSaveRequestDto.toEntity(saveRequestDto);
        await this.userService.saveUser(user);

        const foundUser = await this.userService.findOne(saveRequestDto.userId);

        return Object.assign({
            data: { ...UserSaveResponseDto.fromEntity(foundUser) },
            statusCode: 201,
            statusMsg: `saved successfully`,
        });
    }

    @Delete(':userId')
    async deleteUser(@Param('userId') id: string): Promise<string> {
        await this.userService.deleteUser(id);
        return Object.assign({
            data: { userId: id },
            statusCode: 201,
            statusMsg: `deleted successfully`,
        });
    }
}