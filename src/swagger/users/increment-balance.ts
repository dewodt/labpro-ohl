import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiParam,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ResponseDto } from 'src/common/dto';
import { IncrementUserBalanceRequestDto } from 'src/users/dto';

export function SwaggerIncrementUserBalance() {
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
    // Requestbody
    ApiBody({
      description: 'Amount to increment user balance',
      required: true,
      type: IncrementUserBalanceRequestDto,
      examples: {
        incrementBalance: {
          description: 'Increment user balance successfully',
          summary: 'Increment balance',
          value: new IncrementUserBalanceRequestDto(100),
        },
        negativeValue: {
          description: 'Increment value must be positive (error)',
          summary: 'Negative increment value',
          value: new IncrementUserBalanceRequestDto(-100),
        },
        notANumber: {
          description: 'Increment value must be a number (error)',
          summary: 'Not a number',
          value: {
            increment: 'not a number',
          },
        },
      },
    }),
    // Creaedresponse
    ApiCreatedResponse({
      description: 'Success created',
      content: {
        body: {
          example: ResponseDto.success('Successfully add user balance', {
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
          examples: {
            invalidId: {
              summary: 'Invalid user ID',
              value: ResponseDto.error('Invalid user ID'),
            },
            negativeNumber: {
              summary: 'Negative increment value',
              value: ResponseDto.error('Increment value must be positive'),
            },
            notANumber: {
              summary: 'Not a number',
              value: ResponseDto.error('Increment value must be a number'),
            },
          },
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
      description: 'Resource Not Found',
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
          example: ResponseDto.error('Failed to update user balance'),
        },
      },
    }),
  );
}
