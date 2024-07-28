import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseFilters,
} from '@nestjs/common';
import TypeormExceptionFilter from '../common/exceptions/typeorm.exception';
import LoginUserDto from './dto/login.dto';
import ChangePasswordDto from './dto/change-password.dto';
import Auth from './decorators/auth.decorator';
import getDataReq from './decorators/get-data-req.decorator';
import User from './entities/user.entity';
import AuthService from './auth.service';
import OtpService from '../common/service/otp.service';

@Controller('auth')
@UseFilters(TypeormExceptionFilter)
export default class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly otpService: OtpService,
  ) {}
  @Post('login')
  public login(@Body() dto: LoginUserDto) {
    return this.authService.login(dto);
  }

  @Post('valid/:token')
  public validRefreshToken(@Param('token') token: string) {
    return this.authService.refreshAndValidateToken(token);
  }

  @Get('generate-password')
  public async getPassword() {
    return this.authService.generateRandomPassword();
  }

  @Post('change/password')
  @Auth()
  public async changePassword(
    @Body() { password, passwordConfirm }: ChangePasswordDto,
    @getDataReq(true) user: User,
  ) {
    if (password !== passwordConfirm)
      throw new BadRequestException('Las contraseñas no coinciden');

    await this.authService.changePassword(user.id, password);
  }

  @Post('generate-otp')
  @Auth()
  public async generateOtp(@getDataReq(true) user: User) {
    return this.otpService.saveOtp(user.email);
  }
}
