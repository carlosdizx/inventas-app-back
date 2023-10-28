import { IsNotEmpty, IsEnum } from 'class-validator';
import { Scopes } from '../enums/scopes.enum';

export default class OauthBodyLoginDto {
  @IsNotEmpty({ message: 'grant_type debe ser una cadena de texto' })
  grant_type: string;

  @IsEnum(Scopes, { message: 'Scope invalido' })
  scope: Scopes;
}
