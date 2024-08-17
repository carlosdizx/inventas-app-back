import { IsEnum } from 'class-validator';
import { StatusEntity } from '../../common/enums/status.entity.enum}';

export default class UpdateSaleDto {
  @IsEnum(StatusEntity)
  status: StatusEntity;
}
