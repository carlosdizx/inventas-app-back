import { Body, Controller, Post } from '@nestjs/common';
import SalesService from './sales.service';
import CreateSaleDto from './dto/create-sale.dto';
import getDataReq from '../auth/decorators/get-data-req.decorator';
import Enterprise from '../enterprise/entities/enterprise.entity';
import Auth from '../auth/decorators/auth.decorator';
import { UserRoles } from '../auth/enums/user.roles.enum';

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
}
