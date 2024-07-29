import { IsInt, IsUUID, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export default class ProductQuantityDto {
  @IsInt()
  @Min(1)
  @ApiProperty()
  quantity: number;

  @IsUUID()
  @ApiProperty()
  id: string;
}
