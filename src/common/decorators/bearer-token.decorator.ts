import { ResponseDto } from '../dto';
import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

export const BearerToken = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException(
        new ResponseDto('error', 'Authorization header is missing'),
      );
    }

    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer') {
      throw new UnauthorizedException(
        new ResponseDto('error', 'Authorization header must be Bearer token'),
      );
    }

    if (!token) {
      throw new UnauthorizedException(
        new ResponseDto('error', 'Authorization bearer token is missing'),
      );
    }

    return token;
  },
);
