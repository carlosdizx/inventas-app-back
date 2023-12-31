import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseFilters,
} from '@nestjs/common';
import InventoriesService from './inventories.service';
import Auth from '../auth/decorators/auth.decorator';
import CreateInventoryDto from './dto/create-inventory.dto';
import GetDataReqDecorator from '../auth/decorators/get-data-req.decorator';
import getDataReq from '../auth/decorators/get-data-req.decorator';
import Enterprise from '../enterprise/entities/enterprise.entity';
import { UserRoles } from '../auth/enums/user.roles.enum';
import TypeormExceptionFilter from '../common/exceptions/typeorm.exception';
import ProductQuantityDto from '../sales/dto/product-quantity.dto';

@Controller('inventories')
@UseFilters(TypeormExceptionFilter)
export default class InventoriesController {
  constructor(private readonly inventoriesService: InventoriesService) {}

  @Post()
  @Auth(UserRoles.OWNER)
  public async createInventory(
    @Body() dto: CreateInventoryDto,
    @GetDataReqDecorator() enterprise: Enterprise,
  ) {
    return this.inventoriesService.createInventory(dto, enterprise);
  }

  @Get(':id')
  @Auth(UserRoles.OWNER, UserRoles.CASHIER, UserRoles.ACCOUNTANT)
  public async findInventoryById(
    @Param('id', ParseUUIDPipe) id: string,
    @GetDataReqDecorator() enterprise: Enterprise,
  ) {
    return await this.inventoriesService.findInventoryById(id, enterprise);
  }

  @Put(':id')
  @Auth(UserRoles.OWNER, UserRoles.CASHIER)
  public async addProductsToInventory(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ProductQuantityDto[],
    @getDataReq() enterprise: Enterprise,
  ) {
    return await this.inventoriesService.addProductsToInventory(
      id,
      enterprise,
      dto,
    );
  }
}
