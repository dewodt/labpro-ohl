import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ResponseDto } from 'src/common/dto';

export function SwaggerCreateFilm() {
  return applyDecorators(
    // Auth
    ApiBearerAuth(),
    ApiCookieAuth(),
    // Request body
    ApiBody({
      description: 'Create film request body (form-data)',
      required: true,
      schema: {
        type: 'object',
        properties: {
          title: {
            type: 'string',
          },
          description: {
            type: 'string',
          },
          director: {
            type: 'string',
          },
          release_year: {
            type: 'number',
            format: 'positive',
          },
          genre: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          price: {
            type: 'number',
            format: 'positive',
          },
          duration: {
            type: 'number',
            format: 'positive',
          },
          cover_image: {
            type: 'binary',
          },
          video: {
            type: 'binary',
          },
        },
        required: [
          'title',
          'description',
          'director',
          'release_year',
          'price',
          'duration',
          'video',
        ],
      },
      examples: {
        validCreateFilm: {
          summary: 'Valid Create Film',
          description: 'Create film request body is valid',
          value: {
            title: 'Refined Soft Towels',
            description:
              'The automobile layout consists of a front-engine design, with transaxle-type transmissions mounted at the rear of the engine and four wheel drive',
            director: 'Mr. Kirk Cummings',
            releaseYear: 1963,
            genre: [],
            price: 1455,
            duration: 10462,
            cover_image_url: '<binary data> | null',
            video_url: '<binary data>',
          },
        },
        invalidCreateFilm: {
          summary: 'Invalid Create Film',
          description: 'Invalid create film request body',
          value: {
            title: '',
            description: '',
            director: 'wkwk',
            releaseYear: -1,
            genre: [],
            price: -1455,
            duration: -10462,
            cover_image_url: '<binary data> | null',
            video_url: 'null',
          },
        },
      },
    }),
    // Created response
    ApiCreatedResponse({
      description: 'Created Response',
      content: {
        body: {
          example: ResponseDto.success('Successfully created film', {
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
            titleRequired: {
              summary: 'Title is required',
              value: ResponseDto.error('Title is required'),
            },
            descriptionRequired: {
              summary: 'Description is required',
              value: ResponseDto.error('Description is required'),
            },
            directorRequired: {
              summary: 'Director is required',
              value: ResponseDto.error('Director is required'),
            },
            releaseYearRequired: {
              summary: 'Release year is required',
              value: ResponseDto.error('Release year is required'),
            },
            releaseYearMin: {
              summary: 'Release year must be greater than 1000',
              value: ResponseDto.error(
                'Release year must be greater than 1000',
              ),
            },
            releaseYearNumber: {
              summary: 'Release year must be a number',
              value: ResponseDto.error('Release year must be a number'),
            },
            genreArray: {
              summary: 'Genre must be an array',
              value: ResponseDto.error('Genre must be an array'),
            },
            priceRequired: {
              summary: 'Price is required',
              value: ResponseDto.error('Price is required'),
            },
            priceInt: {
              summary: 'Price must be an integer',
              value: ResponseDto.error('Price must be an integer'),
            },
            pricePositive: {
              summary: 'Price must be a positive number',
              value: ResponseDto.error('Price must be a positive number'),
            },
            durationRequired: {
              summary: 'Duration is required',
              value: ResponseDto.error('Duration is required'),
            },
            durationInt: {
              summary: 'Duration must be an integer',
              value: ResponseDto.error('Duration must be an integer'),
            },
            durationPositive: {
              summary: 'Duration must be a positive number',
              value: ResponseDto.error('Duration must be a positive number'),
            },
            videoRequired: {
              summary: 'Video is required',
              value: ResponseDto.error('Video is required'),
            },
            videoMaxSize: {
              summary: 'Video file size must be less than 50MB',
              value: ResponseDto.error(
                'Video file size must be less than 50MB',
              ),
            },
            videoMimeType: {
              summary: 'Video must be in mp4, or webm',
              value: ResponseDto.error('Video must be in mp4, or webm'),
            },
            coverImageMaxSize: {
              summary: 'Cover image file size must be less than 2MB',
              value: ResponseDto.error(
                'Cover image file size must be less than 2MB',
              ),
            },
            coverImageMimeType: {
              summary: 'Cover image must be in jpg, or png',
              value: ResponseDto.error('Cover image must be in jpg, or png'),
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
    // Forbidden
    ApiForbiddenResponse({
      description: 'Forbidden Request',
      content: {
        body: {
          example: ResponseDto.error('Insufficient access role'),
        },
      },
    }),
    // Internal server error
    ApiInternalServerErrorResponse({
      description: 'Internal Server Error',
      content: {
        body: {
          example: ResponseDto.error('Failed to create film'),
        },
      },
    }),
  );
}
