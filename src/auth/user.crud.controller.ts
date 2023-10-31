import {
  Body,
  Controller,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseFilters,
} from '@nestjs/common';
import TypeormExceptionFilter from '../common/exceptions/typeorm.exception';
import CreateUserDto from './dto/create-user.dto';
import UserCrudService from './user.crud.service';
import UpdateUserDto from './dto/update-user.dto';
import getEnterprise from './decorators/get-enterprise.decorator';
import Enterprise from '../enterprise/entities/enterprise.entity';
import Auth from './decorators/auth.decorator';
import { UserRoles } from './enums/user.roles.enum';

@Controller('users')
@UseFilters(TypeormExceptionFilter)
export default class UserCrudController {
  constructor(private readonly userCrudService: UserCrudService) {}
  @Post()
  @Auth(UserRoles.OWNER)
  public async create(
    @Body() dto: CreateUserDto,
    @getEnterprise() enterprise: Enterprise,
  ) {
    return await this.userCrudService.createUser(dto, enterprise);
  }

  @Patch(':id')
  @Auth(UserRoles.OWNER)
  public async changeStatusAndRoles(
    @Body() dto: UpdateUserDto,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return await this.userCrudService.updateStatusAndRolesById(id, dto);
  }

  public async;
}
