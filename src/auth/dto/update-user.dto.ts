import { PartialType } from '@nestjs/mapped-types';
import CreateUserDto from './create-user.dto';
import { StatusEntity } from '../../common/enums/status.entity.enum}';
import { IsEnum, IsOptional } from 'class-validator';
import { documentTypes } from '../../common/enums/document.type.enum';

export default class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsEnum(documentTypes)
  status?: StatusEntity;
}
