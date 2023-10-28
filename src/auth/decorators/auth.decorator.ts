import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import ClientRoleGuard from '../guards/client-role.guard';
import RoleProtected from './role-protected.decorator';
import { Roles } from '../enums/role.enum';

const Auth = (...roles: Roles[]) => {
  return applyDecorators(
    RoleProtected(...roles),
    UseGuards(AuthGuard(), ClientRoleGuard),
  );
};

export default Auth;
