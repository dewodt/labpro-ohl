import { User } from '../entities/user.entity';

/**
 * Common user data returned by the REST API
 */
export class CommonUserResponseDto {
  id: string;
  username: string;
  email: string;
  balance: number;

  constructor(id: string, username: string, email: string, balance: number) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.balance = balance;
  }

  /**
   * Convert a User entity to a CommonUserDto
   * @param user The User entity to convert
   */
  static fromUser(user: User): CommonUserResponseDto {
    return new CommonUserResponseDto(
      user.id,
      user.username,
      user.email,
      user.balance,
    );
  }

  /**
   * Convert an array of User entities to an array of CommonUserResponseDto
   * @param users The array of User entities to convert
   */
  static fromUsers(users: User[]): CommonUserResponseDto[] {
    return users.map((user) => CommonUserResponseDto.fromUser(user));
  }
}
