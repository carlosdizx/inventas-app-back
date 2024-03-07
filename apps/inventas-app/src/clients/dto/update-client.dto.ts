import { IsEnum, IsOptional } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import CreateClientDto from './create-client.dto';
import { StatusEntity } from '../../common/enums/status.entity.enum}';

export default class UpdateClientDto extends PartialType(CreateClientDto) {
  @IsOptional()
  @IsEnum(StatusEntity)
  status?: StatusEntity;
}
