import { IsStrongPassword } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export default class ChangePasswordDto {
  @IsStrongPassword()
  @ApiProperty()
  password: string;

  @IsStrongPassword()
  @ApiProperty()
  passwordConfirm: string;
}
