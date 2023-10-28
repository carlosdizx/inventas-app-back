import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import ClientRoleGuard from '../guards/client-role.guard';
import RoleProtected from './role-protected.decorator';
import { UserRoles } from '../enums/user.roles.enum';

const Auth = (...roles: UserRoles[]) => {
  return applyDecorators(
    RoleProtected(...roles),
    UseGuards(AuthGuard(), ClientRoleGuard),
  );
};

export default Auth;
