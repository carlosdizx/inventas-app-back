import { Controller, Get, Query } from '@nestjs/common';
import ClientsService from './clients.service';
import Auth from '../auth/decorators/auth.decorator';
import PaginationDto from '../common/dto/pagination.dto';
import getDataReq from '../auth/decorators/get-data-req.decorator';
import Enterprise from '../enterprise/entities/enterprise.entity';

@Controller('clients')
export default class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  @Auth()
  public listCategories(
    @Query() { page, limit }: PaginationDto,
    @getDataReq() enterprise: Enterprise,
  ) {
    return this.clientsService.listClients({ page, limit }, enterprise);
  }
}
