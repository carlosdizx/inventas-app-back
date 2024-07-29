import ChangeStatusDto from '../../common/dto/change-status.dto';
import { IsBoolean, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export default class ChangeStatusForSaleDto extends ChangeStatusDto {
  @IsUUID()
  @ApiProperty()
  id: string;

  @IsBoolean()
  @ApiProperty()
  restore: boolean;
}
