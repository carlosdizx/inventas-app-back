import { SetMetadata } from '@nestjs/common';
import { UserRoles } from '../enums/user.roles.enum';

export const META_ROLES = 'roles';
const RoleProtected = (...args: UserRoles[]) => {
  return SetMetadata(META_ROLES, args);
};

export default RoleProtected;
