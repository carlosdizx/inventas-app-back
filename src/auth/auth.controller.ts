import { Body, Controller, Get, Param, Post, UseFilters } from '@nestjs/common';
import TypeormExceptionFilter from '../common/exceptions/typeorm.exception';
import LoginUserDto from './dto/login.dto';
import AuthService from './auth.service';

@Controller('auth')
@UseFilters(TypeormExceptionFilter)
export default class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  public login(@Body() dto: LoginUserDto) {
    return this.authService.login(dto);
  }

  @Post('valid/:token')
  public validRefreshToken(@Param('token') token: string) {
    return this.authService.refreshAndValidateToken(token);
  }

  @Get('generate/password')
  public async getPassword() {
    return this.authService.generateRandomPassword();
  }
}
