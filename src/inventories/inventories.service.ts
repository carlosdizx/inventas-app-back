import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Inventory from './entities/inventory.entity';
import { DataSource, Repository } from 'typeorm';
import ProductInventory from './entities/product.inventory.entity';
import CreateInventoryDto from './dto/create-inventory.dto';
import Enterprise from '../enterprise/entities/enterprise.entity';
import ProductQuantityDto from '../sales/dto/product-quantity.dto';

@Injectable()
export default class InventoriesService {
  constructor(
    private readonly datasource: DataSource,
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

  public addProductsToInventory = async (
    id: string,
    enterprise: Enterprise,
    productsQuantity: ProductQuantityDto[],
  ) => {
    const inventory = await this.inventoryRepository.findOneBy({
      id,
      enterprise: { id: enterprise.id },
    });

    if (!inventory) throw new NotFoundException('Inventario no existe');

    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      for (const productQuantity of productsQuantity) {
        let productInventory = await this.productInventoryRepository.findOne({
          where: {
            inventory: { id: inventory.id },
            product: { id: productQuantity.id },
          },
        });

        if (productInventory) {
          productInventory.quantity += productQuantity.quantity;
          await queryRunner.manager.save(ProductInventory, productInventory);
        } else {
          productInventory = this.productInventoryRepository.create({
            inventory,
            product: { id: productQuantity.id },
            quantity: productQuantity.quantity,
          });
          await queryRunner.manager.save(ProductInventory, productInventory);
        }
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(
        `Error al tratar de registrar los productos en el inventario: ${error} - ${error.message}`,
      );
    } finally {
      await queryRunner.release();
    }
  };
}
