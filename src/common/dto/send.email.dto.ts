import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export default class SendEmailDto {
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty()
  from: string;

  @IsEmail()
  @ApiProperty()
  to: string;

  @IsNotEmpty()
  @ApiProperty()
  subject: string;

  @IsNotEmpty()
  @ApiProperty()
  html: string;
}
