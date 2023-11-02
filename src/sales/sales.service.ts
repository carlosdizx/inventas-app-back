import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import Sale from './entities/sale.entity';
import { InjectRepository } from '@nestjs/typeorm';
import SaleDetails from './entities/sale.details.entity';
import CreateSaleDto from './dto/create-sale.dto';
import ProductsService from '../products/products.service';
import Enterprise from '../enterprise/entities/enterprise.entity';

@Injectable()
export default class SalesService {
  constructor(
    private readonly datasource: DataSource,
    @InjectRepository(Sale) private readonly saleRepository: Repository<Sale>,
    @InjectRepository(SaleDetails)
    private readonly saleDetailsRepository: Repository<SaleDetails>,
    private readonly productsService: ProductsService,
  ) {}

  public registerSale = async (
    { products, ...resData }: CreateSaleDto,
    enterprise: Enterprise,
  ) => {
    const productsFound =
      await this.productsService.findProductsMappedByIdsAndEnterprise(
        products,
        enterprise,
      );

    return productsFound;
  };
}
