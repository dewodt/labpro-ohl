import { IsNotEmpty, IsString } from 'class-validator';

export class LoginRequestDto {
  @IsString({ message: 'Username must be a string' })
  @IsNotEmpty({ message: 'Username is required' })
  username: string;

  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}

export class LoginResponseDto {
  token: string;

  username: string;

  constructor(token: string, username: string) {
    this.token = token;
    this.username = username;
  }
}
