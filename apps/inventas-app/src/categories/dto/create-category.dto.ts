import {
  ArrayUnique,
  IsArray,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export default class CreateCategoryDto {
  @IsNotEmpty()
  @MinLength(2)
  name: string;

  @IsNotEmpty()
  description: string;

  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  subcategories: string[];
}
