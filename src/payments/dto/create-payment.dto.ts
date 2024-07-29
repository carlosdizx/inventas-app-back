import { IsNumber, IsUUID, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export default class CreatePaymentDto {
  @IsNumber()
  @Min(10)
  @Max(1000000)
  @ApiProperty()
  totalAmount: number;

  @IsUUID()
  @ApiProperty()
  clientId: string;
}
