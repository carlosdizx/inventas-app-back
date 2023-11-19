import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserRoles } from '../enums/user.roles.enum';
import { documentTypes } from '../../common/enums/document.type.enum';

export default class CreateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty({ message: 'Password no puede estar vació' })
  @MinLength(6, { message: 'Mínimo de caracteres es 6' })
  @MaxLength(50, { message: 'Máximo de caracteres es 50' })
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'El password debería tener una mayúscula, una minúscula y un numero',
  })
  password: string = Math.random().toString(36).slice(-20);

  @IsArray()
  @IsEnum(UserRoles, { each: true })
  roles: UserRoles[];

  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  documentNumber: string;

  @IsEnum(documentTypes)
  documentType: documentTypes;

  @IsNotEmpty()
  phone: string;

  @IsBoolean()
  gender: boolean;

  @IsDateString()
  birthdate: Date;
}
