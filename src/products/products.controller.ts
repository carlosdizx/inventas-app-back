import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseFilters,
} from '@nestjs/common';
import ProductsService from './products.service';
import TypeormExceptionFilter from '../common/exceptions/typeorm.exception';
import Auth from '../users/decorators/auth.decorator';
import CreateProductDto from './dto/create-product.dto';
import getDataReq from '../users/decorators/get-data-req.decorator';
import Enterprise from '../enterprise/entities/enterprise.entity';
import { UserRoles } from '../users/enums/user.roles.enum';
import PaginationDto from '../common/dto/pagination.dto';
import UpdateProductDto from './dto/update-product.dto';

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

  @Patch(':id')
  @Auth()
  public updateProduct(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProductDto,
  ) {
    return this.productsService.updateProductById(id, dto);
  }

  @Get(':id')
  @Auth()
  public findProductById(
    @Param('id', ParseUUIDPipe) id: string,
    @getDataReq() enterprise: Enterprise,
  ) {
    return this.productsService.findProductById(id, enterprise);
  }

  @Get('find/all')
  @Auth()
  public async findAllProducts(@getDataReq() enterprise: Enterprise) {
    return await this.productsService.findAllProducts(enterprise);
  }
}
