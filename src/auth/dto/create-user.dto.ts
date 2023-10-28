import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { UserRoles } from '../enums/user.roles.enum';
import { UserTypeDocument } from '../enums/user.type.document.enum';

export default class CreateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsArray()
  @IsEnum(UserRoles, { each: true })
  roles?: UserRoles[] = Object.values(UserRoles) as any;

  @IsNotEmpty()
  first_name: string;

  @IsNotEmpty()
  last_name: string;

  @IsNotEmpty()
  documentNumber: string;

  @IsEnum(UserTypeDocument)
  documentType: UserTypeDocument;

  @IsNotEmpty()
  phone: string;

  @IsBoolean()
  gender: boolean;

  @IsDateString()
  birthdate: Date;
}
