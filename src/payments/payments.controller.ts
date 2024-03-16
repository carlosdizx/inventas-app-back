import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseFilters,
} from '@nestjs/common';
import PaymentsService from './payments.service';
import CreatePaymentDto from './dto/create-payment.dto';
import Auth from '../auth/decorators/auth.decorator';
import PaginationDto from '../common/dto/pagination.dto';
import GetDataReqDecorator from '../auth/decorators/get-data-req.decorator';
import Enterprise from '../enterprise/entities/enterprise.entity';
import TypeormExceptionFilter from '../common/exceptions/typeorm.exception';

@Controller('payments')
@UseFilters(TypeormExceptionFilter)
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

  @Get('client/:id')
  @Auth()
  public async getPaymentsByClientId(
    @Param('id') clientId: string,
    @GetDataReqDecorator() enterprise: Enterprise,
  ) {
    return this.paymentsService.findAllPaymentsByClient(clientId, enterprise);
  }
}
