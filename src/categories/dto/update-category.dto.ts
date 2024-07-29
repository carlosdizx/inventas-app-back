import { PartialType } from '@nestjs/mapped-types';
import CreateCategoryDto from './create-category.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { StatusEntity } from '../../common/enums/status.entity.enum}';
import { ApiProperty } from '@nestjs/swagger';

export default class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @IsOptional()
  @IsEnum(StatusEntity)
  @ApiProperty({ description: 'Estado de la categoría' })
  status?: StatusEntity;
}
