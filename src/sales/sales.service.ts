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

@Injectable()
export default class SalesService {
  constructor(
    private readonly datasource: DataSource,
    @InjectRepository(Sale) private readonly saleRepository: Repository<Sale>,
    @InjectRepository(SaleDetails)
    private readonly saleDetailsRepository: Repository<SaleDetails>,
    private readonly productsService: ProductsService,
    private readonly errorDatabaseService: ErrorDatabaseService,
  ) {}

  public registerSale = async (
    { productsIds, inventoryId, ...resData }: CreateSaleDto,
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

    const sale = this.saleRepository.create({
      ...resData,
      inventory: { id: inventoryId },
      enterprise,
      totalAmount,
    });

    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.startTransaction();

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
      .andWhere('sale.status = :status', { status: StatusEntity.ACTIVE });

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
      throw new ConflictException('Estado de la venta no permitido');
    const sale = await this.saleRepository.findOneBy({
      id,
      enterprise: { id: enterprise.id },
    });
    if (!sale) throw new NotFoundException('Venta no encontrada');
    sale.status = status;
    await this.saleRepository.save(sale);
  };
}
