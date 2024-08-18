import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';

/**
 * Catches UnauthorizedException from JwtAuthGuard and redirects to login page
 */
@Catch(UnauthorizedException)
export class RedirectUnauthorizedFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const status = exception.getStatus();

    res.status(status).redirect('/auth/login');
  }
}
