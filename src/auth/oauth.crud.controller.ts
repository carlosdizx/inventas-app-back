import { Body, Controller, Get, Post, Query, UseFilters } from '@nestjs/common';
import CreateOauth2ClientDto from './dto/create.oauth2-client.dto';
import PaginationDto from '../common/dto/pagination.dto';
import TypeormExceptionFilter from '../common/exceptions/typeorm.exception';
import OauthCrudService from './oauth.crud.service';

@Controller('oauth')
@UseFilters(TypeormExceptionFilter)
export default class OauthCrudController {
  constructor(private readonly crudService: OauthCrudService) {}
  @Post('register')
  async registerClient(@Body() dto: CreateOauth2ClientDto) {
    return this.crudService.createClient(dto);
  }

  @Get('all')
  async listClients(@Query() dto: PaginationDto) {
    return this.crudService.listClients(dto);
  }
}
