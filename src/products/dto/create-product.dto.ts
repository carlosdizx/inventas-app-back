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
  sellingPrice: number;

  @IsNumber()
  purchasePrice: number;

  @IsOptional()
  @IsInt()
  discountPercentage = 0;

  @IsUUID()
  category: string;
}
