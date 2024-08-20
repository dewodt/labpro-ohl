import { applyDecorators } from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { ResponseDto } from 'src/common/dto';

export function SwaggerWebMovieDetail() {
  return applyDecorators(
    ApiOkResponse({
      description: 'Render movie detail page',
    }),
    ApiNotFoundResponse({
      description: 'Movie not found',
      example: ResponseDto.error('Movie not found'),
    }),
    ApiInternalServerErrorResponse({
      description: 'Internal server error, failed to get movie detail',
      example: ResponseDto.error(
        'Internal server error, failed to get movie detail',
      ),
    }),
  );
}
