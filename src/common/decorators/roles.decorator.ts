import { SetMetadata, CustomDecorator } from '@nestjs/common';
import { Role } from 'src/users/entities/user.entity';

export const Roles = (...roles: Role[]): CustomDecorator =>
  SetMetadata('roles', roles);
