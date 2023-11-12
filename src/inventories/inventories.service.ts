import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Inventory from './entities/inventory.entity';
import { Repository } from 'typeorm';
import ProductInventory from './entities/product.inventory.entity';
import CreateInventoryDto from './dto/create-inventory.dto';
import Enterprise from '../enterprise/entities/enterprise.entity';

@Injectable()
export default class InventoriesService {
  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
    @InjectRepository(ProductInventory)
    private readonly productInventoryRepository: Repository<ProductInventory>,
  ) {}

  public createInventory = async (
    { location }: CreateInventoryDto,
    enterprise: Enterprise,
  ) => {
    const inventory = await this.inventoryRepository.save({
      location,
      enterprise,
    });
    return await this.inventoryRepository.save(inventory);
  };

  public findInventoryById = async (id: string, enterprise: Enterprise) =>
    await this.inventoryRepository.findOne({
      where: { id, enterprise: { id: enterprise.id } },
    });
}
