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
import { ApiProperty } from '@nestjs/swagger';

export default class CreateUserDto {
  @IsEmail()
  email: string;

  @IsArray()
  @ApiProperty()
  @IsEnum(UserRoles, { each: true })
  roles: UserRoles[] = [UserRoles.OWNER];

  @IsNotEmpty()
  @ApiProperty()
  firstName: string;

  @IsNotEmpty()
  @ApiProperty()
  lastName: string;

  @IsNotEmpty()
  @ApiProperty()
  documentNumber: string;

  @IsEnum(documentTypes)
  @ApiProperty()
  documentType: documentTypes;

  @IsNotEmpty()
  @ApiProperty()
  phone: string;

  @IsBoolean()
  @ApiProperty()
  gender: boolean;

  @IsDateString()
  @ApiProperty()
  birthdate: Date;
}
