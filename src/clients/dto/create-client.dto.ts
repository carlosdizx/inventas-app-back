import { IsEmail, IsEnum, IsNotEmpty, MinLength } from 'class-validator';
import { documentTypes } from '../../common/enums/document.type.enum';

export default class CreateClientDto {
  @IsNotEmpty()
  @MinLength(3)
  documentNumber: string;

  @IsEnum(documentTypes)
  documentType: documentTypes;

  @IsNotEmpty()
  @MinLength(3)
  names: string;

  @IsNotEmpty()
  @MinLength(3)
  surnames: string;

  @IsNotEmpty()
  @MinLength(3)
  phone: string;

  @IsEmail()
  email: string;
}
