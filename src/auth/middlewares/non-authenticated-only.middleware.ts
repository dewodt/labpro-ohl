import { JwtPayload } from '../auth.interface';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class NonAuthenticatedOnlyMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const cookieToken = req.cookies['labpro-ohl-auth'];
    if (!cookieToken) {
      // No cookie, proceed
      next();
      return;
    }

    // Validate jwt token
    try {
      const jwtPayload =
        await this.jwtService.verifyAsync<JwtPayload>(cookieToken);
      req.user = {
        id: jwtPayload.sub,
        email: jwtPayload.email,
        role: jwtPayload.role,
        username: jwtPayload.username,
      };
    } catch (error) {
      // Invalid token, delete cookie and redirect to login
      res.clearCookie('labpro-ohl-auth');
      res.redirect('/auth/login');
      return;
    }

    // Token is valid, redirect to dashboard
    res.redirect('/my-movies');
  }
}
