import { Reflector } from '@nestjs/core';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  BadRequestException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { META_SCOPES } from '../decorators/scopes-protected.decorator';
import * as jwt from 'jsonwebtoken';

@Injectable()
export default class ScopeGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validScopes: string[] = this.reflector.get(
      META_SCOPES,
      context.getHandler(),
    );

    if (!validScopes) return true;
    if (validScopes.length === 0) return true;

    const { authorization } = context.switchToHttp().getRequest().headers;

    if (!authorization)
      throw new BadRequestException(
        'El endpoint no pudo leer la cabecera de autenticación',
      );
    const [bearer, token] = authorization.split(' ');
    if (bearer !== 'Bearer' || !token)
      throw new BadRequestException('El formato del token no es válido');
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (validScopes.includes(decoded['scope'])) return true;
    } catch (error) {
      throw new UnauthorizedException('Token no valido para este recurso');
    }
    throw new ForbiddenException('Token no valido para este recurso');
  }
}
