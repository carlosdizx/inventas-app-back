import { IsEnum } from 'class-validator';
import { StatusEntity } from '../enums/status.entity.enum}';
import { ApiProperty } from '@nestjs/swagger';

export default class ChangeStatusDto {
  @IsEnum(StatusEntity)
  @ApiProperty()
  status: StatusEntity;
}
