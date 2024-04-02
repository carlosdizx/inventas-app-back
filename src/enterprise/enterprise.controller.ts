import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseFilters,
} from '@nestjs/common';
import EnterpriseService from './enterprise.service';
import CreateEnterpriseDTO from './dto/create-enterprise.dto';
import TypeormExceptionFilter from '../common/exceptions/typeorm.exception';
import Auth from '../auth/decorators/auth.decorator';
import { UserRoles } from '../auth/enums/user.roles.enum';
import PaginationDto from '../common/dto/pagination.dto';
import ChangeStatusDto from '../common/dto/change-status.dto';
import ChangePlanDto from './dto/change-plan.dto';

@Controller('enterprises')
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

  @Get(':id')
  @Auth(UserRoles.SUPER_ADMIN)
  public async findById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.enterpriseService.findEnterpriseAndOwnerById(id);
  }

  @Put('status/:id')
  @Auth(UserRoles.SUPER_ADMIN)
  public async changeStatusEnterprise(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ChangeStatusDto,
  ) {
    return await this.enterpriseService.changeStatus(id, dto);
  }

  @Put('plan/:id')
  @Auth(UserRoles.SUPER_ADMIN)
  public async changePlanEnterprise(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() { id: planId }: ChangePlanDto,
  ) {
    return await this.enterpriseService.changePlanEnterprise(id, planId);
  }
}
