import { Controller, Get, Query } from '@nestjs/common';
import PlanService from './plan.service';
import PaginationDto from '../common/dto/pagination.dto';
import Auth from '../auth/decorators/auth.decorator';
import { UserRoles } from '../auth/enums/user.roles.enum';

@Controller('plans')
export default class PlanController {
  constructor(private readonly planService: PlanService) {}

  @Get()
  @Auth(UserRoles.SUPER_ADMIN)
  public async listPlans(@Query() { page, limit }: PaginationDto) {
    return this.planService.listPlans({ page, limit });
  }
}
