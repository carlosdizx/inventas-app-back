import { Module } from '@nestjs/common';
import SalesService from './sales.service';
import SalesController from './sales.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Sale from './entities/sale.entity';
import SaleDetails from './entities/sale.details.entity';
import ProductsModule from '../products/products.module';
import InventoriesModule from '../inventories/inventories.module';
import ClientsModule from '../clients/clients.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Sale, SaleDetails]),
    ProductsModule,
    InventoriesModule,
    ClientsModule,
  ],
  controllers: [SalesController],
  providers: [SalesService],
})
export default class SalesModule {}
