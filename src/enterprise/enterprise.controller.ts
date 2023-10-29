import { Body, Controller, Post } from '@nestjs/common';
import EnterpriseService from './enterprise.service';
import CreateEnterpriseDTO from './dto/create-enterprise.dto';

@Controller('enterprise')
export default class EnterpriseController {
  constructor(private readonly enterpriseService: EnterpriseService) {}

  @Post()
  public createEnterpriseAndUser(@Body() dto: CreateEnterpriseDTO) {
    return this.enterpriseService.registerEnterprise(dto);
  }
}
