import {
  IsEmail,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsUUID,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import CreateUserDto from '../../users/dto/create-user.dto';
import { Type } from 'class-transformer';

export default class CreateEnterpriseDTO {
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsEmail()
  email: string;

  @MaxLength(100)
  @IsOptional()
  address?: string;

  @IsObject()
  @ValidateNested()
  @Type(() => CreateUserDto)
  user: CreateUserDto;

  @IsUUID()
  planId: string;
}
