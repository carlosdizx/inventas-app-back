import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
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
import UpdateSaleDto from './dto/update-sale.dto';
import GetDataReqDecorator from '../auth/decorators/get-data-req.decorator';

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
  @Auth(UserRoles.OWNER, UserRoles.ACCOUNTANT, UserRoles.CASHIER)
  public async listCategories(
    @Query(ValidationPipe) { page, limit }: PaginationDto,
    @getDataReq() enterprise: Enterprise,
  ) {
    return await this.salesService.listSales({ page, limit }, enterprise);
  }

  @Patch(':id')
  @Auth(UserRoles.OWNER)
  public async updateSale(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateSaleDto,
    @GetDataReqDecorator() enterprise: Enterprise,
  ) {
    return this.salesService.updateSaleById(id, dto, enterprise);
  }
}
