import { applyDecorators, UseGuards } from '@nestjs/common';
import { Scopes } from '../enums/scopes.enum';
import scopesProtected from './scopes-protected.decorator';
import ScopeGuard from '../guards/scope.guard';

const ValidateScope = (...scopes: Scopes[]) =>
  applyDecorators(scopesProtected(...scopes), UseGuards(ScopeGuard));

export default ValidateScope;
