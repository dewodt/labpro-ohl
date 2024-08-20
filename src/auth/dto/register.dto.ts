import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterRequestDto {
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  @MaxLength(255, { message: 'Email must be at most 255 characters long' }) // Db constraint
  email: string;

  @IsString({ message: 'Username must be a string' })
  @IsNotEmpty({ message: 'Username is required' })
  @MaxLength(255, { message: 'Username must be at most 255 characters long' }) // Db constraint
  username: string;

  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  @MaxLength(255, { message: 'Name must be at most 255 characters long' }) // Db constraint
  name: string;

  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(20, { message: 'Password must be at most 20 characters long' })
  @Matches(/^(?=.*[a-z])/, {
    message: 'Password must contain a lowercase letter',
  })
  @Matches(/^(?=.*[A-Z])/, {
    message: 'Password must contain an uppercase letter',
  })
  @Matches(/^(?=.*[0-9])/, {
    message: 'Password must contain a number',
  })
  @Matches(/^(?=.*[!@#$%^&*])/, {
    message: 'Password must contain a special character',
  })
  password: string;

  constructor(email: string, username: string, name: string, password: string) {
    this.email = email;
    this.username = username;
    this.name = name;
    this.password = password;
  }
}

export class RegisterResponseDto {
  id: string;

  email: string;

  username: string;

  name: string;

  role: string;

  constructor(
    id: string,
    email: string,
    username: string,
    name: string,
    role: string,
  ) {
    this.id = id;
    this.email = email;
    this.username = username;
    this.name = name;
    this.role = role;
  }
}
