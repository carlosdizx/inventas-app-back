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

@Controller('users')
@UseFilters(TypeormExceptionFilter)
export default class UserCrudController {
  constructor(private readonly userCrudService: UserCrudService) {}
  @Post()
  public async create(@Body() dto: CreateUserDto) {
    return await this.userCrudService.createUser(dto);
  }

  @Patch(':id')
  public async changeStatus(
    @Body() dto: UpdateUserDto,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return { id, ...dto };
  }
}
