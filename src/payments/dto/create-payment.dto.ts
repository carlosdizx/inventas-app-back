import { IsNumber, IsUUID, Max, Min } from 'class-validator';

export default class CreatePaymentDto {
  @IsNumber()
  @Min(10)
  @Max(1000000)
  totalAmount: number;

  @IsUUID()
  clientId: string;

  @IsUUID()
  inventoryId: string;
}
