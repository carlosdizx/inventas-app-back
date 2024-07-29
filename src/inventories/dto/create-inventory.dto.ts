import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export default class CreateInventoryDto {
  @IsNotEmpty()
  @MaxLength(50)
  @MinLength(3)
  @ApiProperty()
  location: string;
}
