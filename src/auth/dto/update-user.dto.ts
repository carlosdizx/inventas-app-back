import { StatusEntity } from '../../common/enums/status.entity.enum}';
import { IsArray, IsEnum, IsOptional } from 'class-validator';
import { UserRoles } from '../enums/user.roles.enum';

export default class UpdateUserDto {
  @IsOptional()
  @IsArray()
  @IsEnum(UserRoles, { each: true })
  roles?: UserRoles[];

  @IsOptional()
  @IsEnum(StatusEntity)
  status?: StatusEntity;
}
