import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseFilters,
} from '@nestjs/common';
import ClientsService from './clients.service';
import Auth from '../users/decorators/auth.decorator';
import PaginationDto from '../common/dto/pagination.dto';
import getDataReq from '../users/decorators/get-data-req.decorator';
import Enterprise from '../enterprise/entities/enterprise.entity';
import { UserRoles } from '../users/enums/user.roles.enum';
import CreateClientDto from './dto/create-client.dto';
import UpdateClientDto from './dto/update-client.dto';
import TypeormExceptionFilter from '../common/exceptions/typeorm.exception';

@Controller('clients')
@UseFilters(TypeormExceptionFilter)
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
  @Auth(UserRoles.OWNER, UserRoles.CASHIER, UserRoles.ADMIN)
  public async createClient(
    @Body() dto: CreateClientDto,
    @getDataReq() enterprise: Enterprise,
  ) {
    return this.clientsService.createClient(dto, enterprise);
  }

  @Get(':id')
  @Auth(UserRoles.OWNER, UserRoles.CASHIER, UserRoles.ADMIN)
  public async findClientById(
    @Param('id', ParseUUIDPipe) id: string,
    @getDataReq() enterprise: Enterprise,
  ) {
    return this.clientsService.findClientById(id, enterprise);
  }

  @Patch(':id')
  @Auth(UserRoles.OWNER, UserRoles.CASHIER)
  public async updateClientById(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateClientDto,
  ) {
    return this.clientsService.updateClientById(id, dto);
  }

  @Get('find/all')
  @Auth(UserRoles.OWNER, UserRoles.CASHIER, UserRoles.ADMIN)
  public async findAllClients(@getDataReq() enterprise: Enterprise) {
    return this.clientsService.findAllClients(enterprise);
  }

  @Post('send-mail/:clientId/:inventoryId')
  @Auth(UserRoles.OWNER, UserRoles.CASHIER, UserRoles.ADMIN)
  public async sendEmailForPayment(
    @Param('clientId', ParseUUIDPipe) clientId: string,
    @Param('inventoryId', ParseUUIDPipe) inventoryId: string,
    @getDataReq() enterprise: Enterprise,
  ) {
    return this.clientsService.sendEmailForPayment(
      clientId,
      inventoryId,
      enterprise,
    );
  }
}
