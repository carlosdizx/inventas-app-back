import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import ProductQuantityDto from './product-quantity.dto';

export default class CreateSaleDto {
  @IsNotEmpty()
  documentClient: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ProductQuantityDto)
  productsIds: ProductQuantityDto[];

  @IsUUID()
  inventoryId: string;
}
