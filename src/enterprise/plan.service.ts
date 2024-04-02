import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import PlanEnterprise from './entities/plan.enterprise.entity';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { InjectRepository } from '@nestjs/typeorm';
import CreatePlanEnterpriseDto from './dto/create-plan.dto';

@Injectable()
export default class PlanService {
  constructor(
    @InjectRepository(PlanEnterprise)
    private readonly planEnterpriseRepository: Repository<PlanEnterprise>,
  ) {}

  public listPlans = async ({ page, limit }: IPaginationOptions) => {
    const queryBuilder = this.planEnterpriseRepository
      .createQueryBuilder('planEnterprise')
      .orderBy('planEnterprise.createdAt', 'DESC')
      .skip(+page * +limit)
      .take(+limit);

    return await paginate<PlanEnterprise>(queryBuilder, {
      page,
      limit,
      route: 'plans',
    });
  };

  public createPlanEnterprise = async (dto: CreatePlanEnterpriseDto) => {
    const planEnterprise = this.planEnterpriseRepository.create(dto);
    return this.planEnterpriseRepository.save(planEnterprise);
  };
}
