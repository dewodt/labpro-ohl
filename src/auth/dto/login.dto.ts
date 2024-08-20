import { IsNotEmpty, IsString } from 'class-validator';

export class LoginRequestDto {
  @IsString({ message: 'Username or email must be a string' })
  @IsNotEmpty({ message: 'Username or email is required' })
  username: string; // Username or email but body key must use "username" so FE Admin can connect

  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  password: string;

  constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
  }
}

export class LoginResponseDto {
  token: string;

  username: string;

  constructor(token: string, username: string) {
    this.token = token;
    this.username = username;
  }
}
