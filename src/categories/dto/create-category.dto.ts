import {
  ArrayUnique,
  IsArray,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export default class CreateCategoryDto {
  @ApiProperty({ description: 'Nombre de la categoría' })
  @IsNotEmpty()
  @MinLength(2)
  name: string;

  @IsString()
  @ApiProperty({ description: 'Descripción' })
  description: string;

  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  @ApiProperty({ description: 'Sub-categoría de la categoría' })
  subcategories: string[];
}
