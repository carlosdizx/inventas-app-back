import { IsEnum } from 'class-validator';
import { StatusEntity } from '../../common/enums/status.entity.enum}';
import { ApiProperty } from '@nestjs/swagger';

export default class UpdateSaleDto {
  @IsEnum(StatusEntity)
  @ApiProperty()
  status: StatusEntity;
}
