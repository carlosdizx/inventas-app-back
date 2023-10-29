import { Controller, UseFilters } from '@nestjs/common';
import TypeormExceptionFilter from '../common/exceptions/typeorm.exception';

@Controller('auth')
@UseFilters(TypeormExceptionFilter)
export default class AuthController {}
