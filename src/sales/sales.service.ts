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
import Product from '../products/entities/product.entity';

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
    const productsFound: Product[] =
      await this.productsService.findProductsByIdsAndEnterprise(
        products.map(({ id }) => id),
        enterprise,
      );
    if (products.length !== productsFound.length)
      throw new ConflictException('Un producto no existe o esta repetido');

    const prodsMapped = productsFound.map(({ id, salePrice }) => {
      const { quantity } = products.find((product) => product.id === id);
      return {
        id,
        salePrice,
        quantity,
      };
    });
    return prodsMapped;
    //const sale = this.saleRepository.create({ ...resData });
  };
}
