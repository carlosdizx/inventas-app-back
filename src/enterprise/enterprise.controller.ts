import { Body, Controller, Post, UseFilters } from '@nestjs/common';
import EnterpriseService from './enterprise.service';
import CreateEnterpriseDTO from './dto/create-enterprise.dto';
import TypeormExceptionFilter from '../common/exceptions/typeorm.exception';
import Auth from '../auth/decorators/auth.decorator';
import { UserRoles } from '../auth/enums/user.roles.enum';

@Controller('enterprise')
@UseFilters(TypeormExceptionFilter)
export default class EnterpriseController {
  constructor(private readonly enterpriseService: EnterpriseService) {}

  @Post()
  @Auth(UserRoles.SUPER_ADMIN)
  public createEnterpriseAndUser(@Body() dto: CreateEnterpriseDTO) {
    return this.enterpriseService.createEnterpriseAndUser(dto);
  }
}
