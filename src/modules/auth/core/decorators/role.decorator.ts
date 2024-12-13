import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/modules/user/core/enums/user_role';

export const UserRoles = (...roles: UserRole[]) => SetMetadata('roles', roles);
