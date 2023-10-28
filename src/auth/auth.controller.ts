import { Body, Controller, Post, UseFilters } from '@nestjs/common';
import AuthService from './auth.service';
import CreateUserDto from './dto/create-user.dto';
import TypeormExceptionFilter from '../common/exceptions/typeorm.exception';

@Controller('auth')
@UseFilters(TypeormExceptionFilter)
export default class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post()
  public createUser(@Body() dto: CreateUserDto) {
    return this.authService.createUser(dto);
  }
}
