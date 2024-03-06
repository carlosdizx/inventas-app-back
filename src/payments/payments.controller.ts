import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import PaymentsService from './payments.service';
import CreatePaymentDto from './dto/create-payment.dto';
import PaginationDto from '../../apps/inventas-app/src/common/dto/pagination.dto';
import Auth from '../../apps/inventas-app/src/auth/decorators/auth.decorator';
import GetDataReqDecorator from '../../apps/inventas-app/src/auth/decorators/get-data-req.decorator';
import Enterprise from '../../apps/inventas-app/src/enterprise/entities/enterprise.entity';

@Controller('payments')
export default class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get('find/all/credits')
  @Auth()
  public async findAllCredits(
    @Query() { page, limit }: PaginationDto,
    @GetDataReqDecorator() enterprise: Enterprise,
  ) {
    return this.paymentsService.findAllSalesWithCredit(
      { page, limit },
      enterprise,
    );
  }

  @Post()
  @Auth()
  public async registerPayment(
    @Body() dto: CreatePaymentDto,
    @GetDataReqDecorator() enterprise: Enterprise,
  ) {
    return await this.paymentsService.registerPayment(dto, enterprise);
  }
}
