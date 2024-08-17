import ChangeStatusDto from '../../common/dto/change-status.dto';
import { IsUUID } from 'class-validator';

export default class ChangeStatusForPaymentDto extends ChangeStatusDto {
  @IsUUID()
  id: string;
}
