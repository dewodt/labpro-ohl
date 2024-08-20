import { applyDecorators } from '@nestjs/common';
import { ApiOkResponse, ApiTemporaryRedirectResponse } from '@nestjs/swagger';

export function SwaggerWebRegister() {
  return applyDecorators(
    ApiTemporaryRedirectResponse({
      description: 'Redirect to /my-movies if user is logged in',
    }),
    ApiOkResponse({
      description: 'Render register page',
    }),
  );
}
