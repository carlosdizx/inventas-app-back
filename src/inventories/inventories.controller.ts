import { Controller } from '@nestjs/common';
import InventoriesService from './inventories.service';

@Controller('inventories')
export default class InventoriesController {
  constructor(private readonly inventoriesService: InventoriesService) {}
}
