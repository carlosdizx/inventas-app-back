import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { Roles } from '../enums/role.enum';

export default class CreateOauth2ClientDto {
  @IsNotEmpty({ message: 'El nombre de la compañía no debería estar vacío' })
  businessName: string;

  @IsEmail({}, { message: 'Por favor ingrese un email valido' })
  email: string;

  @IsOptional()
  @IsBoolean({
    message: "El campo habilitado debe ser 'activo' o 'inactivo' (booleano)",
  })
  enabled?: boolean;

  @IsDate({ message: 'La fecha válida hasta debe ser una fecha válida.' })
  @IsOptional()
  validUntil?: Date;

  @IsOptional()
  @IsEnum(Roles, {
    each: true,
    message: `Rol inválido, roles permitidos ${Object.values(Roles)}`,
  })
  @IsArray({ message: 'Roles debe ser una matriz' })
  roles?: Roles[];
}
