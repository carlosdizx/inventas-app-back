import ChangeStatusDto from '../../common/dto/change-status.dto';
import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export default class ChangeStatusForPaymentDto extends ChangeStatusDto {
  @IsUUID()
  @ApiProperty()
  id: string;
}
