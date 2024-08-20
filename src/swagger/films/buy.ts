import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCookieAuth,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ResponseDto } from 'src/common/dto';

export function SwaggerBuyFilm() {
  return applyDecorators(
    // Auth
    ApiBearerAuth(),
    ApiCookieAuth(),
    // Param
    ApiParam({
      name: 'id',
      description: 'Film ID',
      example: '3e1f934b-145f-4866-84ce-686838161ca5',
      format: 'uuid',
      required: true,
    }),
    // Ok response
    ApiOkResponse({
      description: 'OK Response',
      content: {
        body: {
          example: ResponseDto.success('Successfully deleted film data', {
            balanceLeft: 389,
            film: {
              id: 'df9720d4-0555-4002-a0cd-f6e6490985ce',
              title: 'Refined Soft Towels',
              director: 'Mr. Kirk Cummings',
              releaseYear: 1963,
              genre: null,
              price: 1455,
              duration: 10462,
              cover_image_url:
                'https://res.cloudinary.com/dvzs47hay/image/upload/v1724076037/labpro-ohl/cover-images/z3zdjnmena91r2zdhiy5.jpg',
              video_url:
                'https://res.cloudinary.com/dvzs47hay/video/upload/v1723814059/labpro-ohl/videos/gndbsy92asiebapklnje.mp4',
              description:
                'The automobile layout consists of a front-engine design, with transaxle-type transmissions mounted at the rear of the engine and four wheel drive',
              created_at: new Date('2024-08-19T14:35:01.746Z'),
              updated_at: new Date('2024-08-19T14:35:01.746Z'),
            },
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
            insufficientBalance: {
              summary: 'Insufficient balance',
              value: ResponseDto.error('Insufficient balance'),
            },
            invalidFilmId: {
              summary: 'Invalid film ID',
              value: ResponseDto.error('Invalid film ID'),
            },
            haveBoughtFilm: {
              summary: 'Already bought film',
              value: ResponseDto.error('User already bought film'),
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
    // Not found
    ApiNotFoundResponse({
      description: 'Resource not found',
      content: {
        body: {
          example: ResponseDto.error('Film not found'),
        },
      },
    }),
    // Internal server error
    ApiInternalServerErrorResponse({
      description: 'Internal Server Error',
      content: {
        body: {
          example: ResponseDto.error('Failed to buy film'),
        },
      },
    }),
  );
}
