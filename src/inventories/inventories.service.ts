import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
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
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import ProductsService from '../products/products.service';
import { CRUD, INVENTORY, SERVER } from '../common/constants/messages.constant';

@Injectable()
export default class InventoriesService {
  private readonly logger = new Logger(InventoriesService.name);

  constructor(
    private readonly datasource: DataSource,
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
    @InjectRepository(ProductInventory)
    private readonly productInventoryRepository: Repository<ProductInventory>,
    private readonly productsService: ProductsService,
  ) {}

  public createInventory = async (
    { name, country, state, city, address, zipCode }: CreateInventoryDto,
    enterprise: Enterprise,
  ) => {
    const inventory = await this.inventoryRepository.save({
      enterprise,
      name,
      country,
      state,
      city,
      address,
      zipCode,
    });
    return await this.inventoryRepository.save(inventory);
  };

  public findInventoryById = async (
    id: string,
    enterprise: Enterprise,
    sale: boolean,
  ) => {
    const inventory = await this.inventoryRepository.findOne({
      where: {
        id,
        enterprise: { id: enterprise.id },
      },
      relations: ['productInventories', 'productInventories.product'],
    });
    if (!inventory) throw new NotFoundException(CRUD.NOT_FOUND);

    if (!sale) return inventory;

    const productWithoutInventory =
      await this.productsService.findProductsNotRequiereInventory(enterprise);
    return {
      ...inventory,
      productInventories: inventory.productInventories.concat(
        productWithoutInventory.map((item) => ({ product: item })) as any,
      ),
    };
  };

  public addProductsToInventory = async (
    id: string,
    enterprise: Enterprise,
    productsQuantity: ProductQuantityDto[],
  ) => {
    const inventory = await this.inventoryRepository.findOneBy({
      id,
      enterprise: { id: enterprise.id },
    });

    if (!inventory) throw new NotFoundException(CRUD.NOT_FOUND);

    const productsInventory: ProductInventory[] = [];

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
        productsInventory.push(productInventory);
      } else {
        const product = await this.productsService.findProductById(
          productQuantity.id,
          enterprise,
        );
        if (product.status !== StatusEntity.ACTIVE)
          throw new ConflictException(INVENTORY.INACTIVE_PRODUCT);
        productInventory = this.productInventoryRepository.create({
          inventory,
          product: { id: productQuantity.id },
          quantity: productQuantity.quantity,
        });
        productsInventory.push(productInventory);
      }
    }
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.save(productsInventory);
      await queryRunner.commitTransaction();
    } catch (error) {
      this.logger.error(error);
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(SERVER.FATAL);
    } finally {
      await queryRunner.release();
    }
  };

  public removeProductsFromInventory = async (
    id: string,
    productsQuantity: ProductQuantityDto[],
  ) => {
    const inventory = await this.inventoryRepository.findOneBy({ id });

    if (!inventory) throw new NotFoundException(CRUD.NOT_FOUND);

    const productsInventories: ProductInventory[] = [];

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
      } else throw new NotFoundException(INVENTORY.INACTIVE_PRODUCT);
    }

    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.startTransaction();
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
      .leftJoin('inventory.productInventories', 'productInventory')
      .leftJoin('productInventory.product', 'product')
      .select('inventory.id', 'id')
      .addSelect('inventory.name', 'name')
      .addSelect('SUM(productInventory.quantity)', 'total')
      .where('inventory.enterprise.id = :id', { id })
      .groupBy('inventory.id')
      .addGroupBy('inventory.name')
      .orderBy('inventory.name');

    const total = await queryBuilder.getCount();

    const results = await queryBuilder
      .offset((+page - 1) * +limit)
      .limit(+limit)
      .getRawMany();

    const meta = {
      totalItems: total,
      itemCount: results.length,
      itemsPerPage: limit,
      totalPages: Math.ceil(total / +limit),
      currentPage: page,
    };

    const baseUrl = 'inventories';
    const links = {
      first: `${baseUrl}?limit=${limit}`,
      previous: +page > 1 ? `${baseUrl}?page=${+page - 1}&limit=${limit}` : '',
      next:
        +page < meta.totalPages
          ? `${baseUrl}?page=${+page + 1}&limit=${limit}`
          : '',
      last: `${baseUrl}?page=${meta.totalPages}&limit=${limit}`,
    };

    return {
      items: results,
      meta,
      links,
    };
  };

  public findAllInventories = async (enterprise: Enterprise) => {
    return this.inventoryRepository.find({
      where: { enterprise: { id: enterprise.id } },
      relations: ['productInventories', 'productInventories.product'],
    });
  };
}
