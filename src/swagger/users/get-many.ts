import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCookieAuth,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiQuery,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ResponseDto } from 'src/common/dto';

export function SwaggerGetManyUser() {
  return applyDecorators(
    // Auth
    ApiBearerAuth(),
    ApiCookieAuth(),
    // Query params
    ApiQuery({
      name: 'q',
      required: false,
      description: 'Search query by username, case insensitive',
      example: 'dmin',
    }),
    // 200 response
    ApiOkResponse({
      description: 'OK Response',
      content: {
        body: {
          example: ResponseDto.success('Successfully retrieved users data', [
            {
              id: '2a2b6219-a4c7-446b-a674-dbf15a8d75ca',
              username: 'user1',
              email: 'user1@mail.com',
              balance: 389,
            },
            {
              id: '552c2f94-d7d9-4516-963a-af714a0e4094',
              username: 'user2',
              email: 'user2@mail.com',
              balance: 774,
            },
          ]),
        },
      },
    }),
    // Unathorized
    ApiUnauthorizedResponse({
      description: 'Unauthorized Request',
      content: {
        body: {
          example: ResponseDto.error('Unauthorized'),
        },
      },
    }),
    // Forbidden
    ApiForbiddenResponse({
      description: 'Forbidden Request',
      content: {
        body: {
          example: ResponseDto.error('Insufficient access role'),
        },
      },
    }),
    // 500 response
    ApiInternalServerErrorResponse({
      description: 'Internal Server Error',
      content: {
        body: {
          example: ResponseDto.error('Failed to get users'),
        },
      },
    }),
  );
}
