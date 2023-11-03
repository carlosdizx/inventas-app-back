import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import SalesService from './sales.service';
import CreateSaleDto from './dto/create-sale.dto';
import getDataReq from '../auth/decorators/get-data-req.decorator';
import Enterprise from '../enterprise/entities/enterprise.entity';
import Auth from '../auth/decorators/auth.decorator';
import { UserRoles } from '../auth/enums/user.roles.enum';
import PaginationDto from '../common/dto/pagination.dto';

@Controller('sales')
export default class SalesController {
  constructor(private readonly salesService: SalesService) {}
  @Post()
  @Auth(UserRoles.CASHIER, UserRoles.OWNER)
  async registerSale(
    @Body() dto: CreateSaleDto,
    @getDataReq() enterprise: Enterprise,
  ) {
    return await this.salesService.registerSale(dto, enterprise);
  }

  @Get()
  @Auth()
  public async listCategories(
    @Query(ValidationPipe) { page, limit }: PaginationDto,
    @getDataReq() enterprise: Enterprise,
  ) {
    return await this.salesService.listSales({ page, limit }, enterprise);
  }
}
