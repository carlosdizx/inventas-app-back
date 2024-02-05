import {
  ConflictException,
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
import { StatusEntity } from '../common/enums/status.entity.enum}';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import ProductsService from '../products/products.service';

@Injectable()
export default class InventoriesService {
  constructor(
    private readonly datasource: DataSource,
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
    @InjectRepository(ProductInventory)
    private readonly productInventoryRepository: Repository<ProductInventory>,
    private readonly productsService: ProductsService,
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
          relations: ['product'],
        });
        if (productInventory) {
          if (productInventory.product.status !== StatusEntity.ACTIVE)
            throw new ConflictException('Hay un producto inactivo');
          productInventory.quantity += productQuantity.quantity;
          await queryRunner.manager.save(ProductInventory, productInventory);
        } else {
          console.log(productQuantity);
          debugger;
          const product = await this.productsService.findProductById(
            productQuantity.id,
            enterprise,
          );
          console.log(product);
          if (product.status !== StatusEntity.ACTIVE)
            throw new ConflictException('Hay un producto inactivo');
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

  public removeProductsFromInventory = async (
    id: string,
    productsQuantity: ProductQuantityDto[],
  ) => {
    const inventory = await this.inventoryRepository.findOneBy({ id });

    if (!inventory) {
      throw new NotFoundException('Inventario no existe');
    }

    const productsInventories: ProductInventory[] = [];

    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.startTransaction();
    for (const productQuantity of productsQuantity) {
      const productInventory = await this.productInventoryRepository.findOne({
        where: {
          inventory: { id: inventory.id },
          product: { id: productQuantity.id, status: StatusEntity.ACTIVE },
        },
        relations: ['product'],
      });

      if (productInventory) {
        if (productInventory.quantity < productQuantity.quantity) {
          let message = 'El inventario cuenta con la cantidad de ';
          message += `${productInventory.quantity}`;
          message += ' para el producto/servicio ';
          message += `'${productInventory.product.name}'`;

          throw new ConflictException(message);
        } else {
          productInventory.quantity -= productQuantity.quantity;
          productsInventories.push(productInventory);
        }
      } else
        throw new NotFoundException(
          'Hay un producto en el inventario que no ha sido encontrado o está inactivo',
        );
    }

    try {
      await queryRunner.manager.save(ProductInventory, productsInventories);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  };

  public listInventories = async (
    { page, limit }: IPaginationOptions,
    { id }: Enterprise,
  ) => {
    const queryBuilder = this.inventoryRepository
      .createQueryBuilder('inventory')
      .where('inventory.enterprise.id = :id', { id });
    return await paginate<Inventory>(queryBuilder, {
      page,
      limit,
      route: 'inventories',
    });
  };
}
