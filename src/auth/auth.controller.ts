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
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Public, ReqUser } from 'src/common/decorators';
import { BearerToken } from 'src/common/decorators/bearer-token.decorator';
import { ResponseDto } from 'src/common/dto/response.dto';
import {
  SwaggerSelf,
  SwaggerLogin,
  SwaggerLogout,
  SwaggerRegister,
} from 'src/swagger/auth';

@ApiTags('API: Auth')
@Controller()
@UseGuards(JwtAuthGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @SwaggerLogin()
  @Post('login')
  @Public()
  @HttpCode(200)
  async login(
    @Body() body: LoginRequestDto,
    @Res({ passthrough: true }) respose: Response,
  ) {
    // Call login service
    const result = await this.authService.login(body);

    // Map result to response
    const responseData = new LoginResponseDto(
      result.token,
      result.user.username,
    );

    // Set cookie
    respose.cookie('labpro-ohl-auth', result.token, {
      maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    return new ResponseDto('success', 'Login success', responseData);
  }

  @SwaggerLogout()
  @Get('logout')
  @Public()
  @HttpCode(200)
  async logout(@Res({ passthrough: true }) respose: Response) {
    // Clear cookie
    respose.clearCookie('labpro-ohl-auth');

    return new ResponseDto('success', 'Logout success');
  }

  @SwaggerRegister()
  @Post('register')
  @Public()
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

  @SwaggerSelf()
  @Get('self')
  @HttpCode(200)
  async self(@BearerToken() bearerToken: string, @ReqUser() user: UserPayload) {
    // Map response
    const responseData = new SelfResponseDto(user.username, bearerToken);

    // Return response
    return new ResponseDto('success', 'Success getting self', responseData);
  }
}
