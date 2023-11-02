import { Module } from '@nestjs/common';
import SalesService from './sales.service';
import SalesController from './sales.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Sale from './entities/sale.entity';
import SaleDetails from './entities/sale.details.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sale, SaleDetails])],
  controllers: [SalesController],
  providers: [SalesService],
})
export default class SalesModule {}
