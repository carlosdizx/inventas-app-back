import { PartialType } from '@nestjs/mapped-types';
import CreateProductDto from './create-product.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { StatusEntity } from '../../common/enums/status.entity.enum}';

export default class UpdateProductDto extends PartialType(CreateProductDto) {
  @IsOptional()
  @IsEnum(StatusEntity)
  status?: StatusEntity;
}
