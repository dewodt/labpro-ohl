import { SetMetadata, CustomDecorator } from '@nestjs/common';
import { Role } from 'src/users/entities/user.entity';

export const ROLES_KEY = 'roles';

export const Roles = (...roles: Role[]): CustomDecorator =>
  SetMetadata(ROLES_KEY, roles);
