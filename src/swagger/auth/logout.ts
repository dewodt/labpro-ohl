import { applyDecorators } from '@nestjs/common';
import { ApiInternalServerErrorResponse, ApiOkResponse } from '@nestjs/swagger';
import { ResponseDto } from 'src/common/dto';

export function SwaggerLogout() {
  return applyDecorators(
    // 200
    ApiOkResponse({
      description: 'OK Response',
      content: {
        body: {
          example: ResponseDto.success('Logout success', null),
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
