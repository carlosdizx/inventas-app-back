import { IsInt, IsUUID } from 'class-validator';

export default class ProductQuantityDto {
  @IsInt()
  quantity: number;

  @IsUUID()
  id: string;
}
