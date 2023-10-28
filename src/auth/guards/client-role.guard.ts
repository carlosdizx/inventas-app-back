import { Reflector } from '@nestjs/core';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import Oauth2Client from '../entities/oauth2.client.entity';
import { META_ROLES } from '../decorators/role-protected.decorator';

@Injectable()
export default class ClientRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRoles: string[] = this.reflector.get(
      META_ROLES,
      context.getHandler(),
    );

    if (!validRoles) return true;
    if (validRoles.length === 0) return true;

    const req = context.switchToHttp().getRequest();
    const client = req.user as Oauth2Client;

    if (!client) throw new BadRequestException('Cliente no encontrado');

    for (const role of client.roles) {
      if (validRoles.includes(role)) {
        return true;
      }
    }

    throw new ForbiddenException(
      `Cliente '${client.businessName}' requiere un permiso para poder hacer esta acción: [${validRoles}]`,
    );
  }
}
