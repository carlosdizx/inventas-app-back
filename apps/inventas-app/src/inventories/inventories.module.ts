import { Module } from '@nestjs/common';
import InventoriesService from './inventories.service';
import InventoriesController from './inventories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Inventory from './entities/inventory.entity';
import ProductInventory from './entities/product.inventory.entity';
import ProductsModule from '../products/products.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Inventory, ProductInventory]),
    ProductsModule,
  ],
  controllers: [InventoriesController],
  providers: [InventoriesService],
  exports: [InventoriesService],
})
export default class InventoriesModule {}
