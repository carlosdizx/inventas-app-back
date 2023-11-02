import { Body, Controller, Get, Post, Query, UseFilters } from '@nestjs/common';
import ProductsService from './products.service';
import TypeormExceptionFilter from '../common/exceptions/typeorm.exception';
import Auth from '../auth/decorators/auth.decorator';
import CreateProductDto from './dto/create-product.dto';
import getDataReq from '../auth/decorators/get-data-req.decorator';
import Enterprise from '../enterprise/entities/enterprise.entity';
import { UserRoles } from '../auth/enums/user.roles.enum';
import PaginationDto from '../common/dto/pagination.dto';

@Controller('products')
@UseFilters(TypeormExceptionFilter)
export default class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Auth(UserRoles.OWNER, UserRoles.CASHIER)
  public createProduct(
    @Body() dto: CreateProductDto,
    @getDataReq() enterprise: Enterprise,
  ) {
    return this.productsService.createProduct(dto, enterprise);
  }

  @Get()
  @Auth()
  public listProducts(
    @Query() { limit, page }: PaginationDto,
    @getDataReq() enterprise: Enterprise,
  ) {
    return this.productsService.listProducts({ limit, page }, enterprise);
  }
}
