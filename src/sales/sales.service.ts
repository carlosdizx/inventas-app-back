import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import Sale from './entities/sale.entity';
import { InjectRepository } from '@nestjs/typeorm';
import SaleDetails from './entities/sale.details.entity';
import CreateSaleDto from './dto/create-sale.dto';
import ProductsService from '../products/products.service';
import Enterprise from '../enterprise/entities/enterprise.entity';
import ErrorDatabaseService from '../common/service/error.database.service';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import UpdateSaleDto from './dto/update-sale.dto';
import { StatusEntity } from '../common/enums/status.entity.enum}';
import InventoriesService from '../inventories/inventories.service';
import ClientsService from '../clients/clients.service';
import Client from '../clients/entities/client.entity';
import ChangeStatusForSaleDto from './dto/change-status-for-sale.dto';
import { CRUD } from '../common/constants/messages.error.constant';

@Injectable()
export default class SalesService {
  constructor(
    private readonly datasource: DataSource,
    @InjectRepository(Sale) private readonly saleRepository: Repository<Sale>,
    private readonly productsService: ProductsService,
    private readonly errorDatabaseService: ErrorDatabaseService,
    private readonly inventoriesService: InventoriesService,
    private readonly clientsService: ClientsService,
  ) {}

  public registerSale = async (
    { productsIds, inventoryId, clientId, ...resData }: CreateSaleDto,
    enterprise: Enterprise,
  ) => {
    const products =
      await this.productsService.findProductsMappedByIdsAndEnterprise(
        productsIds,
        enterprise,
      );

    const totalAmount = products.reduce(
      (total, product) => total + product.salePrice * product.quantity,
      0,
    );

    let clientFound: Client = null;
    if (clientId) {
      clientFound = await this.clientsService.findClientByFilter({
        id: clientId,
        status: StatusEntity.ACTIVE,
        enterprise: { id: enterprise.id },
      });

      if (!clientFound) throw new ConflictException(CRUD.NOT_FOUND);
    }

    const sale = this.saleRepository.create({
      ...resData,
      inventory: { id: inventoryId },
      enterprise,
      totalAmount,
      client: clientFound,
    });

    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.startTransaction();

    await this.inventoriesService.removeProductsFromInventory(
      inventoryId,
      products,
    );

    try {
      const saleSaved = await queryRunner.manager.save<Sale>(sale);
      const saleDetailsToInsert = products.map(
        ({ quantity, salePrice, subtotal, ...restData }) => ({
          sale: saleSaved,
          quantity,
          unitPrice: salePrice,
          subtotal,
          product: restData,
        }),
      );

      await queryRunner.manager
        .getRepository(SaleDetails)
        .insert(saleDetailsToInsert);

      await queryRunner.commitTransaction();
      await queryRunner.release();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.errorDatabaseService.handleException(error);
    }

    return { products, ...sale };
  };

  public listSales = async (
    { page, limit }: IPaginationOptions,
    { id }: Enterprise,
  ) => {
    const queryBuilder = this.saleRepository
      .createQueryBuilder('sale')
      .where('sale.enterprise.id = :id', { id })
      .orderBy('sale.createdAt', 'DESC');
    return await paginate<Sale>(queryBuilder, {
      page,
      limit,
      route: 'sales',
    });
  };

  public updateSaleById = async (
    id: string,
    { status }: UpdateSaleDto,
    enterprise: Enterprise,
  ) => {
    if (status !== StatusEntity.INACTIVE && status !== StatusEntity.ACTIVE)
      throw new ConflictException(CRUD.CONFLICT);
    const sale = await this.saleRepository.findOneBy({
      id,
      enterprise: { id: enterprise.id },
    });
    if (!sale) throw new NotFoundException(CRUD.NOT_FOUND);
    sale.status = status;
    await this.saleRepository.save(sale);
  };

  public findSaleById = async (id: string, enterprise: Enterprise) => {
    const sale = await this.saleRepository.findOne({
      where: { id, enterprise: { id: enterprise.id } },
      relations: ['salesDetails', 'client'],
    });

    sale.salesDetails = sale.salesDetails.map(
      ({
        product: { id, salePrice, name, costPrice, ...restData },
        subtotal,
        quantity,
        unitPrice,
        id: idSale,
      }) => ({
        id: idSale,
        product: { id, salePrice, name, costPrice, ...restData },
        subtotal,
        quantity,
        unitPrice,
      }),
    ) as SaleDetails[];

    return sale;
  };

  public changeStatus = async (
    id: string,
    enterprise: Enterprise,
    { status, restore, id: inventoryId }: ChangeStatusForSaleDto,
  ) => {
    const sale = await this.findSaleById(id, enterprise);
    if (!sale) throw new NotFoundException(CRUD.NOT_FOUND);

    if (
      (sale.status === StatusEntity.ACTIVE ||
        sale.status === StatusEntity.INACTIVE) &&
      (status === StatusEntity.PENDING_CONFIRMATION ||
        status === StatusEntity.PENDING_APPROVAL)
    )
      throw new ConflictException(CRUD.CONFLICT);

    sale.status = status;

    const products = sale.salesDetails.map(({ quantity, product: { id } }) => ({
      id,
      quantity,
    }));
    if (restore) {
      if (sale.status === StatusEntity.INACTIVE) {
        await this.inventoriesService.addProductsToInventory(
          inventoryId,
          enterprise,
          products,
        );
      } else {
        await this.inventoriesService.removeProductsFromInventory(
          inventoryId,
          products,
        );
      }
    }

    await this.saleRepository.save(sale);
  };
}
