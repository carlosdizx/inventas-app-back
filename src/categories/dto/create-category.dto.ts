import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export default class CreateCategoryDto {
  @IsNotEmpty()
  @MinLength(2)
  name: string;

  @IsString()
  description: string;
}
