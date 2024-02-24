import { Controller } from '@nestjs/common';
import ClientsService from './clients.service';

@Controller('clients')
export default class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}
}
