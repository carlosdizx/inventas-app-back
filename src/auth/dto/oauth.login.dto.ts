import { IsNotEmpty, Length, IsEnum } from 'class-validator';
import { Scopes } from '../enums/scopes.enum';

export default class OauthLoginDto {
  @IsNotEmpty({ message: 'ClientId debe ser una cadena de texto' })
  @Length(32, 32, { message: 'El clientId debe tener 32 caracteres' })
  clientId: string;

  @IsNotEmpty({ message: 'ClientSecret debe ser una cadena de texto' })
  @Length(32, 32, { message: 'El clientSecret debe tener 32 caracteres' })
  clientSecret: string;

  @IsEnum(Scopes, { message: 'Scope invalido' })
  scope: Scopes;
}
