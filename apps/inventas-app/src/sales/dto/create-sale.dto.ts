import {
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsUUID,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import ProductQuantityDto from './product-quantity.dto';
import { TypeSaleEnum } from '../../../../../src/sales/enums/type-sale.enum';

export default class CreateSaleDto {
  @IsUUID()
  inventoryId: string;

  @ValidateIf((o) => o.type === TypeSaleEnum.CREDIT)
  @IsUUID()
  clientId?: string;

  @IsEnum(TypeSaleEnum)
  type: TypeSaleEnum;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ProductQuantityDto)
  productsIds: ProductQuantityDto[];
}
