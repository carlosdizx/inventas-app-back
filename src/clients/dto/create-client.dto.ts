import { IsEmail, IsEnum, IsNotEmpty, MinLength } from 'class-validator';
import { documentTypes } from '../../common/enums/document.type.enum';
import { ApiProperty } from '@nestjs/swagger';

export default class CreateClientDto {
  @IsNotEmpty()
  @MinLength(3)
  @ApiProperty({ description: 'Número de documento' })
  documentNumber: string;

  @IsEnum(documentTypes)
  @ApiProperty({ description: 'Tipo de documento' })
  documentType: documentTypes;

  @IsNotEmpty()
  @MinLength(3)
  @ApiProperty({ description: 'Nombres' })
  names: string;

  @IsNotEmpty()
  @MinLength(3)
  @ApiProperty({ description: 'Apellidos' })
  surnames: string;

  @IsNotEmpty()
  @MinLength(3)
  @ApiProperty({ description: 'Teléfono' })
  phone: string;

  @IsEmail()
  @ApiProperty({ description: 'Email' })
  email: string;
}
