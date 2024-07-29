import { StatusEntity } from '../../common/enums/status.entity.enum}';
import { ArrayMinSize, IsArray, IsEnum, IsOptional } from 'class-validator';
import { UserRoles } from '../enums/user.roles.enum';
import { ApiProperty } from '@nestjs/swagger';

export default class UpdateUserDto {
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @IsEnum(UserRoles, { each: true })
  @ApiProperty()
  roles?: UserRoles[];

  @IsOptional()
  @IsEnum(StatusEntity)
  @ApiProperty()
  status?: StatusEntity;
}
