import { CommonUserDto } from './dto';
import { Role } from './entities/user.entity';
import { UsersService } from './users.service';
import {
  Controller,
  Get,
  Param,
  HttpCode,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards';
import { Roles } from 'src/common/decorators';
import { ResponseDto } from 'src/common/dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
@Roles(Role.ADMIN)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @HttpCode(200)
  async findAll(@Query('q') query: string) {
    // Get all users
    const users = await this.usersService.findAll(query);

    // Map users to CommonUserDto
    const responseData = CommonUserDto.fromUsers(users);

    return ResponseDto.success(
      'Successfully retrieced users data',
      responseData,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    // Get user by ID
    const user = await this.usersService.findOne(id);

    // Map user to CommonUserDto
    const responseData = CommonUserDto.fromUser(user);

    return ResponseDto.success(
      'Successfully retrieved user data',
      responseData,
    );
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }
}
