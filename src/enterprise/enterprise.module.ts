import { Module } from '@nestjs/common';
import EnterpriseService from './enterprise.service';
import EnterpriseController from './enterprise.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Enterprise from './entities/enterprise.entity';
import PlanEnterprise from './entities/plan.enterprise.entity';
import PlanService from './plan.service';
import PlanController from './plan.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Enterprise, PlanEnterprise])],
  controllers: [EnterpriseController, PlanController],
  providers: [EnterpriseService, PlanService],
})
export default class EnterpriseModule {}
