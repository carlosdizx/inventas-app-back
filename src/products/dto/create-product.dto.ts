import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsUUID,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export default class CreateProductDto {
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsNumberString()
  @MinLength(5)
  @IsOptional()
  @ApiProperty()
  barcode: string;

  @IsNumber()
  @ApiProperty()
  salePrice: number;

  @IsNumber()
  @ApiProperty()
  costPrice: number;

  @IsBoolean()
  @IsOptional()
  @ApiProperty()
  requiresInventory = true;

  @IsOptional()
  @IsUUID()
  @ApiProperty()
  category?: string;

  @IsOptional()
  @IsUUID()
  @ApiProperty()
  subcategory?: string;
}
