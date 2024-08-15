import { JwtPayload, UserPayload } from './auth.interface';
import { LoginRequestDto, RegisterRequestDto } from './dto';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { ResponseDto } from 'src/common/dto/response.dto';
import { User } from 'src/users/entities/user.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private dataSource: DataSource,
    private jwtService: JwtService,
  ) {}

  /**
   * Validate user
   *
   * @param usernameOrEmail
   * @param password
   * @returns
   */
  async validateUser(
    usernameOrEmail: string,
    password: string,
  ): Promise<User | null> {
    // Find user by emailOrUsername
    const userRepository = this.dataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: [{ email: usernameOrEmail }, { username: usernameOrEmail }],
    });

    // Check if user exists
    if (!user) {
      return null;
    }

    // Check if password is correct
    const isPasswordCorrect = await compare(password, user.password);
    if (!isPasswordCorrect) {
      return null;
    }

    return user;
  }

  /**
   * Sign UserPayload
   *
   * @param userPayload
   * @returns
   */
  async signJwt(userPayload: UserPayload): Promise<string> {
    const jwtPayload: JwtPayload = {
      sub: userPayload.id,
      username: userPayload.username,
      email: userPayload.email,
      role: userPayload.role,
    };

    // Sign JWT
    const token = await this.jwtService.signAsync(jwtPayload, {
      expiresIn: '1d',
    });

    return token;
  }

  async login(body: LoginRequestDto) {
    // Validate user
    const user = await this.validateUser(body.emailOrUsername, body.password);

    // Check if user exists
    if (!user) {
      throw new UnauthorizedException(
        new ResponseDto('error', 'Invalid credentials'),
      );
    }

    // Sign JWT
    const userPayload: UserPayload = {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };
    const token = await this.signJwt(userPayload);

    return {
      token,
      user,
    };
  }

  async register(body: RegisterRequestDto): Promise<User> {
    // Check if username or email exists
    const userRepository = this.dataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: [{ email: body.email }, { username: body.username }],
    });
    if (user) {
      if (user.email === body.email) {
        throw new BadRequestException(
          new ResponseDto('error', 'Email is already taken'),
        );
      } else if (user.username === body.username) {
        throw new BadRequestException(
          new ResponseDto('error', 'Username is already taken'),
        );
      }
    }

    // Create user
    const hashedPassword = await hash(body.password, 10);

    let insertedUser: User | null = null;
    try {
      const insertResult = await userRepository.insert({
        email: body.email,
        username: body.username,
        name: body.name,
        password: hashedPassword,
      });

      insertedUser = insertResult.identifiers[0] as User;
    } catch (error) {
      // Internal error
      throw new InternalServerErrorException(
        new ResponseDto('error', 'An error occurred'),
      );
    }

    return insertedUser;
  }
}
