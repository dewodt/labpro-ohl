import {
  Controller,
  Get,
  Redirect,
  Render,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { UserPayload } from 'src/auth/auth.interface';
import { JwtAuthGuard } from 'src/auth/guards';
import { Public, ReqUser } from 'src/common/decorators';

@Controller()
@UseGuards(JwtAuthGuard)
export class WebAuthController {
  constructor() {}

  @Get('/')
  @Public()
  @Redirect('/movies')
  home() {}

  @Get('auth/login')
  @Public()
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
  @Public()
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
