import { Body, Controller, Post } from '@nestjs/common';
import InventoriesService from './inventories.service';
import Auth from '../auth/decorators/auth.decorator';
import CreateInventoryDto from './dto/create-inventory.dto';
import GetDataReqDecorator from '../auth/decorators/get-data-req.decorator';
import Enterprise from '../enterprise/entities/enterprise.entity';
import { UserRoles } from '../auth/enums/user.roles.enum';

@Controller('inventories')
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
}
