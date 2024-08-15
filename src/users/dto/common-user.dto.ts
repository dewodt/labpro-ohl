import { User } from '../entities/user.entity';

/**
 * Common user data returned by the REST API
 */
export class CommonUserDto {
  id: string;
  username: string;
  email: string;
  role: string;

  constructor(id: string, username: string, email: string, role: string) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.role = role;
  }

  /**
   * Convert a User entity to a CommonUserDto
   * @param user The User entity to convert
   */
  static fromUser(user: User): CommonUserDto {
    return new CommonUserDto(user.id, user.username, user.email, user.role);
  }

  /**
   * Convert an array of User entities to an array of CommonUserDto
   * @param users The array of User entities to convert
   */
  static fromUsers(users: User[]): CommonUserDto[] {
    return users.map((user) => CommonUserDto.fromUser(user));
  }
}
