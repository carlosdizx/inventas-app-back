import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseFilters,
} from '@nestjs/common';
import InventoriesService from './inventories.service';
import Auth from '../users/decorators/auth.decorator';
import CreateInventoryDto from './dto/create-inventory.dto';
import GetDataReqDecorator from '../users/decorators/get-data-req.decorator';
import getDataReq from '../users/decorators/get-data-req.decorator';
import Enterprise from '../enterprise/entities/enterprise.entity';
import { UserRoles } from '../users/enums/user.roles.enum';
import TypeormExceptionFilter from '../common/exceptions/typeorm.exception';
import ProductQuantityDto from '../sales/dto/product-quantity.dto';
import PaginationDto from '../common/dto/pagination.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('inventories')
@Controller('inventories')
@UseFilters(TypeormExceptionFilter)
export default class InventoriesController {
  constructor(private readonly inventoriesService: InventoriesService) {}

  @Post()
  @Auth(UserRoles.OWNER, UserRoles.ADMIN)
  public async createInventory(
    @Body() dto: CreateInventoryDto,
    @GetDataReqDecorator() enterprise: Enterprise,
  ) {
    return this.inventoriesService.createInventory(dto, enterprise);
  }

  @Get(':id')
  @Auth(UserRoles.OWNER, UserRoles.ADMIN, UserRoles.CASHIER)
  public async findInventoryById(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('sale') sale: string,
    @GetDataReqDecorator() enterprise: Enterprise,
  ) {
    return await this.inventoriesService.findInventoryById(
      id,
      enterprise,
      sale === 'true',
    );
  }

  @Put(':id')
  @Auth(UserRoles.OWNER, UserRoles.ADMIN, UserRoles.CASHIER)
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

  @Get()
  @Auth(UserRoles.OWNER, UserRoles.ADMIN, UserRoles.CASHIER)
  public async listInventories(
    @Query() { page, limit }: PaginationDto,
    @getDataReq() enterprise: Enterprise,
  ) {
    return this.inventoriesService.listInventories({ page, limit }, enterprise);
  }

  @Get('find/all')
  @Auth(UserRoles.OWNER, UserRoles.CASHIER, UserRoles.ADMIN)
  public async findAllInventories(@getDataReq() enterprise: Enterprise) {
    return this.inventoriesService.findAllInventories(enterprise);
  }
}
