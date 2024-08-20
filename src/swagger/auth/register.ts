import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { RegisterRequestDto, RegisterResponseDto } from 'src/auth/dto';
import { ResponseDto } from 'src/common/dto';

export function SwaggerRegister() {
  return applyDecorators(
    // Request body
    ApiBody({
      description: 'Register request body',
      type: RegisterRequestDto,
      examples: {
        userRegister: {
          summary: 'User Register',
          description: 'Register a new user',
          value: new RegisterRequestDto(
            'newuser@gmail.com',
            'newuser',
            'New User',
            'Password123!',
          ),
        },
        usernameTaken: {
          summary: 'Username taken',
          description: 'Username is already taken',
          value: new RegisterRequestDto(
            'newuseremail@gmail.com',
            'user1',
            'New User',
            'Password123!',
          ),
        },
        emailTaken: {
          summary: 'Email taken',
          description: 'Email is already taken',
          value: new RegisterRequestDto(
            'user1@gmail.com',
            'newuser',
            'New User',
            'Password123!',
          ),
        },
        emailRequired: {
          summary: 'Email required',
          description: 'Email is required',
          value: new RegisterRequestDto(
            '',
            'newuser',
            'New User',
            'Password123!',
          ),
        },
        invalidEmail: {
          summary: 'Invalid email',
          description: 'Invalid email format',
          value: new RegisterRequestDto(
            'invalidemail',
            'newuser',
            'New User',
            'Password123!',
          ),
        },
        longEmail: {
          summary: 'Long email',
          description: 'Email must be at most 255 characters long',
          value: new RegisterRequestDto(
            'a'.repeat(256) + '@gmail.com',
            'newuser',
            'New User',
            'Password123!',
          ),
        },
        usernameRequired: {
          summary: 'Username required',
          description: 'Username is required',
          value: new RegisterRequestDto(
            'newuser@gmail.com',
            '',
            'New User',
            'Password123!',
          ),
        },
        longUsername: {
          summary: 'Long username',
          description: 'Username must be at most 255 characters long',
          value: new RegisterRequestDto(
            'newuser' + 'a'.repeat(256) + '@gmail.com',
            'newuser',
            'New User',
            'Password123!',
          ),
        },
        nameRequired: {
          summary: 'Name required',
          description: 'Name is required',
          value: new RegisterRequestDto(
            'newuser@gmail.com',
            'newuser',
            '',
            'Password123!',
          ),
        },
        nameTooLong: {
          summary: 'Name too long',
          description: 'Name must be at most 255 characters long',
          value: new RegisterRequestDto(
            'newuser@gmail.com',
            'newuser',
            'a'.repeat(256),
            'Password123!',
          ),
        },
        passwordRequired: {
          summary: 'Password required',
          description: 'Password is required',
          value: new RegisterRequestDto(
            'newuser@gmail.com',
            'newuser',
            'New User',
            '',
          ),
        },
        shortPassword: {
          summary: 'Short password',
          description: 'Password must be at least 8 characters long',
          value: new RegisterRequestDto(
            'newuser@gmail.com',
            'newuser',
            'New User',
            'shorT1!',
          ),
        },
        longPassword: {
          summary: 'Long password',
          description: 'Password must be at most 20 characters long',
          value: new RegisterRequestDto(
            'newuser@gmail.com',
            'newuser',
            'New User',
            'longlonglonglonglonglonG1!',
          ),
        },
        noLowercasePassword: {
          summary: 'No lowercase password',
          description: 'Password must contain a lowercase letter',
          value: new RegisterRequestDto(
            'newuser@gmail.com',
            'newuser',
            'New User',
            'NOLOWERCASE1!!',
          ),
        },
        noUppercasePassword: {
          summary: 'No uppercase password',
          description: 'Password must contain an uppercase letter',
          value: new RegisterRequestDto(
            'newuser@gmail.com',
            'newuser',
            'New User',
            'nolowercase1!!',
          ),
        },
        noNumberPassword: {
          summary: 'No uppercase password',
          description: 'Password must contain a number',
          value: new RegisterRequestDto(
            'newuser@gmail.com',
            'newuser',
            'New User',
            'nolowercaseLOL!!',
          ),
        },
        noSpecialCharPassword: {
          summary: 'No special character password',
          description: 'Password must contain a special character',
          value: new RegisterRequestDto(
            'newuser@gmail.com',
            'newuser',
            'New User',
            'nolowercaseLOL1',
          ),
        },
      },
    }),
    // 201
    ApiCreatedResponse({
      description: 'Created Response',
      content: {
        body: {
          example: ResponseDto.success(
            'Register success',
            new RegisterResponseDto(
              'a88120b8-d5d2-47ad-a2ab-dc348ad0353e',
              'user1@gmail.com',
              'user1',
              'User 1',
              'USER',
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
            usernameExists: {
              summary: 'Username exists',
              value: ResponseDto.error('Username is already taken'),
            },
            emailExists: {
              summary: 'Email exists',
              value: ResponseDto.error('Email is already taken'),
            },
            noEmail: {
              summary: 'No email',
              value: ResponseDto.error('Email is required'),
            },
            invalidEmail: {
              summary: 'Invalid email',
              value: ResponseDto.error('Invalid email format'),
            },
            tooLongEmail: {
              summary: 'Too long email',
              value: ResponseDto.error(
                'Email must be at most 255 characters long',
              ),
            },
            noUsername: {
              summary: 'No username',
              value: ResponseDto.error('Username is required'),
            },
            tooLongUsername: {
              summary: 'Too long username',
              value: ResponseDto.error(
                'Username must be at most 255 characters long',
              ),
            },
            noName: {
              summary: 'No name',
              value: ResponseDto.error('Name is required'),
            },
            tooLongName: {
              summary: 'Too long name',
              value: ResponseDto.error(
                'Name must be at most 255 characters long',
              ),
            },
            noPassword: {
              summary: 'No password',
              value: ResponseDto.error('Password is required'),
            },
            tooShortPassword: {
              summary: 'Too short password',
              value: ResponseDto.error(
                'Password must be at least 8 characters long',
              ),
            },
            tooLongPassword: {
              summary: 'Too long password',
              value: ResponseDto.error(
                'Password must be at most 20 characters long',
              ),
            },
            noLowercasePassword: {
              summary: 'No lowercase password',
              value: ResponseDto.error(
                'Password must contain a lowercase letter',
              ),
            },
            noUppercasePassword: {
              summary: 'No uppercase password',
              value: ResponseDto.error(
                'Password must contain an uppercase letter',
              ),
            },
            noNumberPassword: {
              summary: 'No number password',
              value: ResponseDto.error('Password must contain a number'),
            },
            noSpecialCharPassword: {
              summary: 'No special character password',
              value: ResponseDto.error(
                'Password must contain a special character',
              ),
            },
          },
        },
      },
    }),
    // 500
    ApiInternalServerErrorResponse({
      description: 'Internal Server Error',
      content: {
        body: {
          example: ResponseDto.error('Internal server error'),
        },
      },
    }),
  );
}
