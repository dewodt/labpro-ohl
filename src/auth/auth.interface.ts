import { Role } from 'src/users/entities/user.entity';

export interface JwtPayload {
  sub: string; // Subject (the user ID)
  username: string;
  email: string;
  role: Role;
  iat?: number; // Issued At
  exp?: number; // Expiration
}

export interface UserPayload {
  id: string;
  username: string;
  email: string;
  role: Role;
}
