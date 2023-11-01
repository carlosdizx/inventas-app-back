import { IsNotEmpty, MinLength } from 'class-validator';

export default class CreateCategoryDto {
  @IsNotEmpty()
  @MinLength(2)
  name: string;

  @IsNotEmpty()
  description: string;
}
