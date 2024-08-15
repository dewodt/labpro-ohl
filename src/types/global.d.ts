import { UserPayload } from 'src/auth/auth.interface';

export declare global {
  // Extend the Express.User interface to include the JwtPayload interface
  namespace Express {
    interface Request {
      user: UserPayload
    }
  }
}