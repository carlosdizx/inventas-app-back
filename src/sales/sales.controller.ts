import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
  UseFilters,
  ValidationPipe,
} from '@nestjs/common';
import SalesService from './sales.service';
import CreateSaleDto from './dto/create-sale.dto';
import getDataReq from '../users/decorators/get-data-req.decorator';
import GetDataReqDecorator from '../users/decorators/get-data-req.decorator';
import Enterprise from '../enterprise/entities/enterprise.entity';
import Auth from '../users/decorators/auth.decorator';
import { UserRoles } from '../users/enums/user.roles.enum';
import PaginationDto from '../common/dto/pagination.dto';
import UpdateSaleDto from './dto/update-sale.dto';
import TypeormExceptionFilter from '../common/exceptions/typeorm.exception';
import ChangeStatusForSaleDto from './dto/change-status-for-sale.dto';

@Controller('sales')
@UseFilters(TypeormExceptionFilter)
export default class SalesController {
  constructor(private readonly salesService: SalesService) {}
  @Post()
  @Auth(UserRoles.CASHIER, UserRoles.OWNER, UserRoles.ADMIN)
  async registerSale(
    @Body() dto: CreateSaleDto,
    @getDataReq() enterprise: Enterprise,
  ) {
    return await this.salesService.registerSale(dto, enterprise);
  }

  @Get()
  @Auth(
    UserRoles.OWNER,
    UserRoles.ACCOUNTANT,
    UserRoles.CASHIER,
    UserRoles.ADMIN,
  )
  public async listCategories(
    @Query(ValidationPipe) { page, limit, inventoryId }: PaginationDto,
    @getDataReq() enterprise: Enterprise,
  ) {
    return await this.salesService.listSales(
      { page, limit },
      enterprise,
      inventoryId,
    );
  }

  @Patch(':id')
  @Auth(UserRoles.OWNER, UserRoles.ADMIN)
  public async updateSale(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateSaleDto,
    @GetDataReqDecorator() enterprise: Enterprise,
  ) {
    return this.salesService.updateSaleById(id, dto, enterprise);
  }

  @Get(':id')
  @Auth(UserRoles.OWNER, UserRoles.ADMIN)
  public async findSaleById(
    @Param('id', ParseUUIDPipe) id: string,
    @GetDataReqDecorator() enterprise: Enterprise,
  ) {
    return this.salesService.findSaleById(id, enterprise);
  }

  @Put('status/:id')
  @Auth(UserRoles.OWNER, UserRoles.CASHIER, UserRoles.ADMIN)
  public async changeStatusEnterprise(
    @Param('id', ParseUUIDPipe) id: string,
    @getDataReq() enterprise: Enterprise,
    @Body() dto: ChangeStatusForSaleDto,
  ) {
    return await this.salesService.changeStatus(id, enterprise, dto);
  }
}
