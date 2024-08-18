import { Controller, Get, Render, Res } from '@nestjs/common';
import { Response } from 'express';
import { UserPayload } from 'src/auth/auth.interface';
import { ReqUser } from 'src/common/decorators';

@Controller()
export class WebAuthController {
  constructor() {}

  @Get('auth/login')
  @Render('login')
  login(
    @ReqUser() user: UserPayload | undefined,
    @Res({ passthrough: true }) res: Response,
  ) {
    const isUserLoggedIn = !!user;

    if (isUserLoggedIn) {
      res.redirect('/my-movies');
      return;
    }

    return {
      isUserLoggedIn,
    };
  }

  @Get('auth/register')
  @Render('register')
  register(
    @ReqUser() user: UserPayload | undefined,
    @Res({ passthrough: true }) res: Response,
  ) {
    const isUserLoggedIn = !!user;

    if (isUserLoggedIn) {
      res.redirect('/my-movies');
      return;
    }

    return {
      isUserLoggedIn,
    };
  }
}
