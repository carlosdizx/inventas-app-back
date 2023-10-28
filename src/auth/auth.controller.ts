import { Body, Controller, Post } from '@nestjs/common';
import AuthService from './auth.service';
import CreateUserDto from './dto/create-user.dto';

@Controller('auth')
export default class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post()
  public createUser(@Body() dto: CreateUserDto) {
    return this.authService.createUser(dto);
  }
}
