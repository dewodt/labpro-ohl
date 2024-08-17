import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class WebController {
  @Get('auth/login')
  @Render('login')
  login() {
    return {};
  }

  @Get('auth/register')
  @Render('register')
  register() {
    return {};
  }
}
