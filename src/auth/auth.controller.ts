import { AuthService } from './auth.service';
import { LoginRequestDto, LoginResponseDto, RegisterRequestDto } from './dto';
import { RegisterResponseDto } from './dto/register.dto';
import { Body, Controller, Post } from '@nestjs/common';
import { ResponseDto } from 'src/common/dto/response.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
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
}
