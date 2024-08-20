import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { LoginRequestDto, LoginResponseDto } from 'src/auth/dto';
import { ResponseDto } from 'src/common/dto';

export function SwaggerLogin() {
  return applyDecorators(
    // Request body
    ApiBody({
      description: 'Login request body',
      type: LoginRequestDto,
      examples: {
        userLogin: {
          summary: 'User Login',
          description: 'User login successfull',
          value: new LoginRequestDto('user1', 'password'),
        },
        adminLogin: {
          summary: 'Admin Login',
          description: 'Admin login successfull',
          value: new LoginRequestDto('admin', 'password'),
        },
        noUsername: {
          summary: 'No username',
          description: 'Username is required to login',
          value: new LoginRequestDto('', 'password'),
        },
        noPassword: {
          summary: 'No password',
          description: 'Password is required to login',
          value: new LoginRequestDto('user1', ''),
        },
      },
    }),
    // 200
    ApiOkResponse({
      description: 'OK Response',
      content: {
        body: {
          example: ResponseDto.success(
            'Login success',
            new LoginResponseDto(
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
              'user1',
            ),
          ),
        },
      },
    }),
    // 400
    ApiBadRequestResponse({
      description: 'Bad Request',
      content: {
        body: {
          examples: {
            noUsername: {
              summary: 'No username',
              value: ResponseDto.error('Username is required'),
            },
            noPassword: {
              summary: 'No password',
              value: ResponseDto.error('Password is required'),
            },
          },
        },
      },
    }),
    // 401
    ApiUnauthorizedResponse({
      description: 'Unauthorized Request',
      content: {
        body: {
          example: ResponseDto.error('Invalid credentials'),
        },
      },
    }),
    // 500
    ApiInternalServerErrorResponse({
      description: 'Internal server error',
      content: {
        body: {
          example: ResponseDto.error('Internal server error'),
        },
      },
    }),
  );
}
