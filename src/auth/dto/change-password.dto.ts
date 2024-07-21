import { IsStrongPassword } from 'class-validator';

export default class ChangePasswordDto {
  @IsStrongPassword()
  password: string;

  @IsStrongPassword()
  passwordConfirm: string;
}
