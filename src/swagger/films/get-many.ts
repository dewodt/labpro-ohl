import { applyDecorators } from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { ResponseDto } from 'src/common/dto';

export function SwaggerGetManyFilm() {
  return applyDecorators(
    // Query
    ApiQuery({
      name: 'q',
      required: false,
      description: 'Search query by film title or director, case insensitive',
      example: 'godfather',
    }),
    // Ok response
    ApiOkResponse({
      description: 'OK Response',
      content: {
        body: {
          example: ResponseDto.success('Successfully retrieved film data', [
            {
              id: 'df9720d4-0555-4002-a0cd-f6e6490985ce',
              title: 'Refined Soft Towels',
              director: 'Mr. Kirk Cummings',
              release_year: 1963,
              genre: [],
              price: 1455,
              duration: 10462,
              cover_image_url:
                'https://res.cloudinary.com/dvzs47hay/image/upload/v1724076037/labpro-ohl/cover-images/z3zdjnmena91r2zdhiy5.jpg',
              created_at: '2024-08-19T14:35:01.746Z',
              updated_at: '2024-08-19T14:35:01.746Z',
            },
            {
              id: '717c94a8-da9c-49d4-95af-c179b42fb674',
              title: 'Modern Concrete Soap',
              director: 'Diane Armstrong',
              release_year: 1927,
              genre: ['Action', 'Comedy'],
              price: 1360,
              duration: 5607,
              cover_image_url:
                'https://res.cloudinary.com/dvzs47hay/image/upload/v1724076038/labpro-ohl/cover-images/oig4kltlnn7fqmqwom4p.jpg',
              created_at: '2024-08-19T14:35:01.746Z',
              updated_at: '2024-08-19T14:35:01.746Z',
            },
          ]),
        },
      },
    }),
    // Internal server error
    ApiInternalServerErrorResponse({
      description: 'Internal Server Error',
      content: {
        body: {
          example: ResponseDto.error('Failed to get film data'),
        },
      },
    }),
  );
}
