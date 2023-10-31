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
  public async create(@Body() dto: CreateUserDto) {
    return await this.userCrudService.createUser(dto);
  }

  @Patch(':id')
  @Auth(UserRoles.OWNER)
  public async changeStatus(
    @Body() dto: UpdateUserDto,
    @Param('id', ParseUUIDPipe) id: string,
    @getEnterprise() enterprise: Enterprise,
  ) {
    console.log(enterprise);
    return { id, ...dto };
  }
}
