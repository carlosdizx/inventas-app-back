import {
  IsEmail,
  IsNotEmpty,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export default class LoginUserDto {
  @IsEmail({}, { message: 'El email debe tener el formato correcto' })
  @ApiProperty()
  email: string;

  @IsNotEmpty({ message: 'Password no puede estar vació' })
  @MinLength(6, { message: 'Mínimo de caracteres es 6' })
  @MaxLength(50, { message: 'Máximo de caracteres es 50' })
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'El password debería tener una mayúscula, una minúscula y un numero',
  })
  @ApiProperty()
  password: string;
}
