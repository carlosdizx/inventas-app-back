import { Body, Controller, Post, UseFilters } from '@nestjs/common';
import TypeormExceptionFilter from '../common/exceptions/typeorm.exception';
import CreateUserDto from './dto/create-user.dto';
import UserCrudService from './user.crud.service';

@Controller('users')
@UseFilters(TypeormExceptionFilter)
export default class UserCrudController {
  constructor(private readonly userCrudService: UserCrudService) {}
  @Post()
  public async create(@Body() dto: CreateUserDto) {
    return await this.userCrudService.createUser(dto);
  }
}
