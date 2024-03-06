import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export default class CreateInventoryDto {
  @IsNotEmpty()
  @MaxLength(50)
  @MinLength(3)
  location: string;
}
