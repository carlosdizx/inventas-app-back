import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import ClientsService from './clients.service';
import Auth from '../auth/decorators/auth.decorator';
import PaginationDto from '../common/dto/pagination.dto';
import getDataReq from '../auth/decorators/get-data-req.decorator';
import Enterprise from '../enterprise/entities/enterprise.entity';
import { UserRoles } from '../auth/enums/user.roles.enum';
import CreateClientDto from './dto/create-client.dto';

@Controller('clients')
export default class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  @Auth()
  public async listClients(
    @Query() { page, limit }: PaginationDto,
    @getDataReq() enterprise: Enterprise,
  ) {
    return this.clientsService.listClients({ page, limit }, enterprise);
  }

  @Post()
  @Auth(UserRoles.OWNER, UserRoles.CASHIER)
  public async createClient(
    @Body() dto: CreateClientDto,
    @getDataReq() enterprise: Enterprise,
  ) {
    return this.clientsService.createClient(dto, enterprise);
  }

  @Get(':id')
  @Auth(UserRoles.OWNER, UserRoles.CASHIER)
  public async findClientById(
    @Param('id', ParseUUIDPipe) id: string,
    @getDataReq() enterprise: Enterprise,
  ) {
    return this.clientsService.findClientById(id, enterprise);
  }
}
