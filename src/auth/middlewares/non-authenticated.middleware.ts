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
      await this.jwtService.verifyAsync(cookieToken);
    } catch (error) {
      // Invalid token, delete cookie and redirect to login
      res.clearCookie('labpro-ohl-auth');
      return res.redirect('/auth/login');
    }

    // Token is valid, redirect to dashboard
    return res.redirect('/dashboard');
  }
}
