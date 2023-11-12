import { IsInt, IsUUID, Min } from 'class-validator';

export default class ProductQuantityDto {
  @IsInt()
  @Min(1)
  quantity: number;

  @IsUUID()
  id: string;
}
