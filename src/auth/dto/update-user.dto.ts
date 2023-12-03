import { StatusEntity } from '../../common/enums/status.entity.enum}';
import { ArrayMinSize, IsArray, IsEnum, IsOptional } from 'class-validator';
import { UserRoles } from '../enums/user.roles.enum';

export default class UpdateUserDto {
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @IsEnum(UserRoles, { each: true })
  roles?: UserRoles[];

  @IsOptional()
  @IsEnum(StatusEntity)
  status?: StatusEntity;
}
