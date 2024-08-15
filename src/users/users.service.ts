import { IncrementUserBalanceRequestDto } from './dto';
import { User } from './entities/user.entity';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ResponseDto } from 'src/common/dto';
import { DataSource, ILike } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(private dataSource: DataSource) {}

  async findAll(queryUsername: string): Promise<User[]> {
    // Get all users with the username
    const userRepository = this.dataSource.getRepository(User);

    let users: User[] | null = null;

    try {
      users = await userRepository.find(
        queryUsername
          ? {
              where: {
                username: ILike(`%${queryUsername}%`),
              },
            }
          : undefined,
      );
    } catch (error) {
      // Unexpected error
      throw new InternalServerErrorException(
        ResponseDto.error('Failed to get users'),
      );
    }

    return users;
  }

  async findOne(id: string): Promise<User> {
    // Get user by ID
    const userRepository = this.dataSource.getRepository(User);

    let user: User | null = null;

    try {
      user = await userRepository.findOne({
        where: {
          id,
        },
      });
    } catch (error) {
      // Unexpected error
      throw new InternalServerErrorException(
        ResponseDto.error('Failed to get user'),
      );
    }

    if (!user) {
      // Not found
      throw new NotFoundException(ResponseDto.error('User not found'));
    }

    return user;
  }

  async incrementUserBalance(id: string, body: IncrementUserBalanceRequestDto) {
    // Get user id and validate entity
    const userRepository = this.dataSource.getRepository(User);

    let user: User | null = null;
    try {
      user = await userRepository.findOneBy({ id });
    } catch (error) {
      // Unexpected error
      throw new InternalServerErrorException(
        ResponseDto.error('Failed to get user'),
      );
    }

    if (!user) {
      // Not found
      throw new NotFoundException(ResponseDto.error('User not found'));
    }

    // Increment user
    user.balance += body.increment;
    try {
      user = await userRepository.save(user);
    } catch (error) {
      // Unexpected error
      throw new InternalServerErrorException(
        ResponseDto.error('Failed to increment user balance'),
      );
    }

    return user;
  }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
