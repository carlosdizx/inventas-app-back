import ChangeStatusDto from '../../common/dto/change-status.dto';
import { IsBoolean } from 'class-validator';

export default class ChangeStatusForSaleDto extends ChangeStatusDto {
  @IsBoolean()
  restore: boolean;
}
