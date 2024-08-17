import { IsEnum } from 'class-validator';
import { StatusEntity } from '../enums/status.entity.enum}';

export default class ChangeStatusDto {
  @IsEnum(StatusEntity)
  status: StatusEntity;
}
