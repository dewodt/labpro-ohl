import { applyDecorators } from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { ResponseDto } from 'src/common/dto';

export function SwaggerWebMovies() {
  return applyDecorators(
    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
      description: 'Page number',
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      type: Number,
      description: 'Limit per page',
    }),
    ApiOkResponse({
      description: 'Render movies page',
    }),
    ApiInternalServerErrorResponse({
      description: 'Internal server error, failed to get available movies',
      example: ResponseDto.error(
        'Internal server error, failed to get available movies',
      ),
    }),
  );
}
