import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCookieAuth,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SelfResponseDto } from 'src/auth/dto/self.dto';
import { ResponseDto } from 'src/common/dto';

export function SwaggerSelf() {
  return applyDecorators(
    // Bearer token or Cookie
    ApiBearerAuth(),
    ApiCookieAuth(),
    // No request body
    // 200
    ApiOkResponse({
      description: 'OK Response',
      content: {
        body: {
          example: ResponseDto.success(
            'Success getting self',
            new SelfResponseDto(
              'user1',
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
            ),
          ),
        },
      },
    }),
    // 401
    ApiUnauthorizedResponse({
      description: 'Unauthorized Request',
      content: {
        body: {
          example: ResponseDto.error('Unauthorized'),
        },
      },
    }),
    // 500
    ApiInternalServerErrorResponse({
      description: 'Internal Server Error',
      content: {
        body: {
          example: ResponseDto.error('Internal server error'),
        },
      },
    }),
  );
}
