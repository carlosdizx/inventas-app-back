import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import { documentTypes } from '../../common/enums/document.type.enum';
import CreateUserDto from '../../auth/dto/create-user.dto';
import { Type } from 'class-transformer';

export default class CreateEnterpriseDTO {
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  documentNumber: string;

  @IsEnum(documentTypes)
  @IsNotEmpty()
  documentType: documentTypes;

  @IsObject()
  @ValidateNested()
  @Type(() => CreateUserDto)
  user: CreateUserDto;
}
