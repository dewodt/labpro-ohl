import { UserPayload } from './auth.interface';
import { AuthService } from './auth.service';
import { LoginRequestDto, LoginResponseDto, RegisterRequestDto } from './dto';
import { RegisterResponseDto } from './dto/register.dto';
import { SelfResponseDto } from './dto/self.dto';
import { JwtAuthGuard } from './guards';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ReqUser } from 'src/common/decorators';
import { BearerToken } from 'src/common/decorators/bearer-token.decorator';
import { ResponseDto } from 'src/common/dto/response.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  async login(@Body() body: LoginRequestDto) {
    // Call login service
    const result = await this.authService.login(body);

    // Map result to response
    const responseData = new LoginResponseDto(
      result.token,
      result.user.username,
    );

    return new ResponseDto('success', 'Login success', responseData);
  }

  @Post('register')
  @HttpCode(201)
  async register(@Body() body: RegisterRequestDto) {
    // Call register service
    const result = await this.authService.register(body);

    // Map result to response
    const responseData = new RegisterResponseDto(
      result.id,
      result.email,
      result.username,
      result.name,
      result.role,
    );

    return new ResponseDto('success', 'Register success', responseData);
  }

  @Get('self')
  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  async self(@BearerToken() bearerToken: string, @ReqUser() user: UserPayload) {
    // Map response
    const responseData = new SelfResponseDto(user.username, bearerToken);

    // Return response
    return new ResponseDto('success', 'Success getting self', responseData);
  }
}
