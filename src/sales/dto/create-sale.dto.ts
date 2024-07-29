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
import { TypeSaleEnum } from '../enums/type-sale.enum';
import { ApiProperty } from '@nestjs/swagger';

export default class CreateSaleDto {
  @IsUUID()
  @ApiProperty()
  inventoryId: string;

  @ValidateIf((o) => o.type === TypeSaleEnum.CREDIT)
  @IsUUID()
  @ApiProperty()
  clientId?: string;

  @IsEnum(TypeSaleEnum)
  @ApiProperty()
  type: TypeSaleEnum;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ProductQuantityDto)
  @ApiProperty()
  productsIds: ProductQuantityDto[];
}
