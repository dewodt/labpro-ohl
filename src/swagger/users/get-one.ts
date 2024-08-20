import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCookieAuth,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ResponseDto } from 'src/common/dto';

export function SwaggerGetOneUser() {
  return applyDecorators(
    // Auth
    ApiBearerAuth(),
    ApiCookieAuth(),
    // Param
    ApiParam({
      name: 'id',
      description: 'User ID',
      example: 'fb1773dc-2c65-4764-8641-a831a5118c27',
      format: 'uuid',
      required: true,
    }),
    // Ok response
    ApiOkResponse({
      description: 'OK Response',
      content: {
        body: {
          example: ResponseDto.success('Successfully retrieved user data', {
            id: '2a2b6219-a4c7-446b-a674-dbf15a8d75ca',
            username: 'user1',
            email: 'user1@mail.com',
            balance: 389,
          }),
        },
      },
    }),
    // Bad request
    ApiBadRequestResponse({
      description: 'Bad Request',
      content: {
        body: {
          example: ResponseDto.error('Invalid user ID'),
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
    // Not found response
    ApiNotFoundResponse({
      description: 'Not Found',
      content: {
        body: {
          example: ResponseDto.error('User not found'),
        },
      },
    }),
    // Internal server error
    ApiInternalServerErrorResponse({
      description: 'Internal Server Error',
      content: {
        body: {
          example: ResponseDto.error('Failed to get user'),
        },
      },
    }),
  );
}
