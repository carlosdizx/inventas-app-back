import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
} from 'class-validator';
import { UserRoles } from '../enums/user.roles.enum';
import { documentTypes } from '../../common/enums/document.type.enum';

export default class CreateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsArray()
  @IsEnum(UserRoles, { each: true })
  roles: UserRoles[];

  @IsNotEmpty()
  first_name: string;

  @IsNotEmpty()
  last_name: string;

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
