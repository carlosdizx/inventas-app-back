import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import PlanService from './plan.service';
import PaginationDto from '../common/dto/pagination.dto';
import Auth from '../auth/decorators/auth.decorator';
import { UserRoles } from '../auth/enums/user.roles.enum';
import CreatePlanEnterpriseDto from './dto/create-plan.dto';

@Controller('plans')
export default class PlanController {
  constructor(private readonly planService: PlanService) {}

  @Get()
  @Auth(UserRoles.SUPER_ADMIN)
  public async listPlans(@Query() { page, limit }: PaginationDto) {
    const res = await this.planService.listPlans({ page, limit });

    return {
      ...res,
      items: res.items.map(({ id, name, description, maxUsers }) => ({
        id,
        name,
        description,
        maxUsers,
      })),
    };
  }

  @Post()
  @Auth(UserRoles.SUPER_ADMIN)
  public async createPlanEnterprise(@Body() dto: CreatePlanEnterpriseDto) {
    return await this.planService.createPlanEnterprise(dto);
  }
}
