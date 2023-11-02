import { PartialType } from '@nestjs/mapped-types';
import CreateCategoryDto from './create-category.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { StatusEntity } from '../../common/enums/status.entity.enum}';

export default class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @IsOptional()
  @IsEnum(StatusEntity)
  status?: StatusEntity;
}
