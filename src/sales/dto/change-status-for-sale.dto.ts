import ChangeStatusDto from '../../common/dto/change-status.dto';
import { IsBoolean, IsUUID } from 'class-validator';

export default class ChangeStatusForSaleDto extends ChangeStatusDto {
  @IsUUID()
  id: string;

  @IsBoolean()
  restore: boolean;
}
