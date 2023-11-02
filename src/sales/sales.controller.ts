import { Controller } from '@nestjs/common';
import SalesService from './sales.service';

@Controller('sales')
export default class SalesController {
  constructor(private readonly salesService: SalesService) {}
}
