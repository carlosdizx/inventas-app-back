import { SetMetadata } from '@nestjs/common';
import { Roles } from '../enums/role.enum';

export const META_ROLES = 'roles';
const RoleProtected = (...args: Roles[]) => {
  return SetMetadata(META_ROLES, args);
};

export default RoleProtected;
