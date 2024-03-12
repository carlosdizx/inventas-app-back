import { Body, Controller, Get, Post, Query, UseFilters } from '@nestjs/common';
import EnterpriseService from './enterprise.service';
import CreateEnterpriseDTO from './dto/create-enterprise.dto';
import TypeormExceptionFilter from '../common/exceptions/typeorm.exception';
import Auth from '../auth/decorators/auth.decorator';
import { UserRoles } from '../auth/enums/user.roles.enum';
import PaginationDto from '../common/dto/pagination.dto';

@Controller('enterprise')
@UseFilters(TypeormExceptionFilter)
export default class EnterpriseController {
  constructor(private readonly enterpriseService: EnterpriseService) {}

  @Post()
  @Auth(UserRoles.SUPER_ADMIN)
  public createEnterpriseAndUser(@Body() dto: CreateEnterpriseDTO) {
    return this.enterpriseService.createEnterpriseAndUser(dto);
  }

  @Get()
  @Auth(UserRoles.SUPER_ADMIN)
  public async listEnterprises(@Query() { page, limit }: PaginationDto) {
    return await this.enterpriseService.listEnterprises({ page, limit });
  }
}
