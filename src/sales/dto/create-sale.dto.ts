import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsOptional,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import ProductQuantityDto from './product-quantity.dto';
import { TypeSaleEnum } from '../enums/type-sale.enum';

export default class CreateSaleDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ProductQuantityDto)
  productsIds: ProductQuantityDto[];

  @IsUUID()
  inventoryId: string;

  @IsUUID()
  @IsOptional()
  clientId?: string;

  @IsEnum(TypeSaleEnum)
  type: TypeSaleEnum;
}
