import { Module } from '@nestjs/common';
import EnterpriseService from './enterprise.service';
import EnterpriseController from './enterprise.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Enterprise from './entities/enterprise.entity';
import PlanEnterprise from './entities/plan.enterprise.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Enterprise, PlanEnterprise])],
  controllers: [EnterpriseController],
  providers: [EnterpriseService],
})
export default class EnterpriseModule {}
