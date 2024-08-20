import { applyDecorators } from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTemporaryRedirectResponse,
} from '@nestjs/swagger';
import { ResponseDto } from 'src/common/dto';

export function SwaggerWebMyMovies() {
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
      description: 'Render my movies',
    }),
    ApiTemporaryRedirectResponse({
      description: "Redirect to /auth/login if user hasn't logged in",
    }),
    ApiInternalServerErrorResponse({
      description: 'Internal server error, failed to bought movie',
      example: ResponseDto.error(
        'Internal server error, failed to bought movie',
      ),
    }),
  );
}
