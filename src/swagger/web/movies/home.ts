import { applyDecorators } from '@nestjs/common';
import { ApiTemporaryRedirectResponse } from '@nestjs/swagger';

export function SwaggerWebHome() {
  return applyDecorators(
    ApiTemporaryRedirectResponse({
      description: 'Redirect to /movies',
    }),
  );
}
