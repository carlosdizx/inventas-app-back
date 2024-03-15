import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsUUID,
  MinLength,
} from 'class-validator';

export default class CreateProductDto {
  @IsNotEmpty()
  name: string;

  @IsNumberString()
  @MinLength(5)
  @IsOptional()
  barcode: string;

  @IsNumber()
  salePrice: number;

  @IsNumber()
  costPrice: number;

  @IsBoolean()
  @IsOptional()
  requiresInventory = true;

  @IsOptional()
  @IsUUID()
  category?: string;

  @IsOptional()
  @IsUUID()
  subcategory?: string;
}
