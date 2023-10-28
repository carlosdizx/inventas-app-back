import { Controller, Get } from '@nestjs/common';

@Controller('auth')
export default class AuthController {
  @Get()
  public hello() {
    return [1, 2, 3];
  }
}
