import { JwtPayload, UserPayload } from '../auth.interface';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { PUBLIC_KEY, ROLES_KEY } from 'src/common/decorators';
import { ResponseDto } from 'src/common/dto';
import { Role } from 'src/users/entities/user.entity';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if public
    const isPublic = this.reflector.getAllAndOverride<boolean | undefined>(
      PUBLIC_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (isPublic) {
      return true;
    }

    // Get request
    const request = context.switchToHttp().getRequest<Request>();

    // Get bearer token from request header or cookie
    const bearerToken = this.extractTokenFromHeader(request);
    const cookieToken = this.extractTokenFromCookie(request);

    let resolvedToken: string | undefined;
    // prioritize bearer token
    if (bearerToken) {
      resolvedToken = bearerToken;
    } else if (cookieToken) {
      resolvedToken = cookieToken;
    } else {
      throw new UnauthorizedException(new ResponseDto('error', 'Unauthorized'));
    }

    // Check if token is valid
    let jwtPayload: JwtPayload;
    try {
      jwtPayload = await this.jwtService.verifyAsync<JwtPayload>(resolvedToken);
    } catch (error) {
      throw new UnauthorizedException(new ResponseDto('error', 'Unauthorized'));
    }

    // Check allowed roles from handler + class
    const allowedRoles = this.reflector.getAllAndOverride<Role[] | undefined>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // If decorator is set, check if user role is allowed
    if (allowedRoles && !allowedRoles.includes(jwtPayload.role)) {
      throw new UnauthorizedException(
        new ResponseDto('error', 'Unauthorized: Insufficient role access'),
      );
    }

    // Set user payload to request
    const userPayload: UserPayload = {
      id: jwtPayload.sub,
      email: jwtPayload.email,
      role: jwtPayload.role,
      username: jwtPayload.username,
    };

    request.user = userPayload;

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private extractTokenFromCookie(request: Request): string | undefined {
    return request.cookies['labpro-ohl-auth'];
  }
}
