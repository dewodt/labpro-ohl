import { CommonUserResponseDto, IncrementUserBalanceRequestDto } from './dto';
import { Role } from './entities/user.entity';
import { UsersService } from './users.service';
import {
  Controller,
  Get,
  Param,
  HttpCode,
  Query,
  UseGuards,
  Post,
  Body,
  ParseUUIDPipe,
  Delete,
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
  async findAll(@Query('q') query: string | undefined) {
    // Get all users
    const users = await this.usersService.findAll(query);

    // Map users to CommonUserDto
    const responseData = CommonUserResponseDto.fromUsers(users);

    return ResponseDto.success(
      'Successfully retrieced users data',
      responseData,
    );
  }

  @Get(':id')
  @HttpCode(200)
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    // Get user by ID
    const user = await this.usersService.findOne(id);

    // Map user to CommonUserDto
    const responseData = CommonUserResponseDto.fromUser(user);

    return ResponseDto.success(
      'Successfully retrieved user data',
      responseData,
    );
  }

  @Post(':id/balance')
  @HttpCode(201)
  async incrementBalance(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: IncrementUserBalanceRequestDto,
  ) {
    const updatedUser = await this.usersService.incrementBalance(id, body);

    // Map user to CommonUserDto
    const responseData = CommonUserResponseDto.fromUser(updatedUser);

    return ResponseDto.success(
      'Successfully incremented user balance',
      responseData,
    );
  }

  @Delete(':id')
  @HttpCode(200)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    const deletedUser = await this.usersService.remove(id);

    // Map user to CommonUserDto
    const responseData = CommonUserResponseDto.fromUser(deletedUser);

    return ResponseDto.success('Successfully deleted user', responseData);
  }
}
