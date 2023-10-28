import { SetMetadata } from '@nestjs/common';
import { Scopes } from '../enums/scopes.enum';

export const META_SCOPES = 'scopes';
const scopesProtected = (...args: Scopes[]) => {
  return SetMetadata(META_SCOPES, args);
};

export default scopesProtected;
