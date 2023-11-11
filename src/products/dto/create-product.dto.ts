import {
  IsInt,
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

  @IsNotEmpty()
  @IsNumberString()
  @MinLength(5)
  barcode: string;

  @IsNumber()
  salePrice: number;

  @IsNumber()
  costPrice: number;

  @IsOptional()
  @IsInt()
  discountPercentage = 0;

  @IsOptional()
  @IsUUID()
  category?: string;

  @IsOptional()
  @IsUUID()
  subcategory?: string;
}
