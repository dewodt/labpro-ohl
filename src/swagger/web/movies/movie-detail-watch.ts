import { applyDecorators } from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTemporaryRedirectResponse,
} from '@nestjs/swagger';
import { ResponseDto } from 'src/common/dto';

export function SwaggerWebMovieDetailWatch() {
  return applyDecorators(
    ApiOkResponse({
      description: 'Render movie detail watch page',
    }),
    ApiTemporaryRedirectResponse({
      description: 'Redirect to /movies/{id} if movie has not been bought',
    }),
    ApiTemporaryRedirectResponse({
      description: "Redirect to /auth/login if user hasn't logged in",
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
