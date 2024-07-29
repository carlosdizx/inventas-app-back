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
import { ApiProperty } from '@nestjs/swagger';

export default class CreateEnterpriseDTO {
  @IsNotEmpty()
  @MaxLength(100)
  @ApiProperty()
  name: string;

  @IsEmail()
  @ApiProperty()
  email: string;

  @MaxLength(100)
  @IsOptional()
  @ApiProperty()
  address?: string;

  @IsObject()
  @ValidateNested()
  @Type(() => CreateUserDto)
  @ApiProperty()
  user: CreateUserDto;

  @IsUUID()
  @ApiProperty()
  planId: string;
}
