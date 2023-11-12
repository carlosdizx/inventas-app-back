import { Module } from '@nestjs/common';
import InventoriesService from './inventories.service';
import InventoriesController from './inventories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Inventory from './entities/inventory.entity';
import ProductInventory from './entities/product.inventory.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Inventory, ProductInventory])],
  controllers: [InventoriesController],
  providers: [InventoriesService],
})
export default class InventoriesModule {}
