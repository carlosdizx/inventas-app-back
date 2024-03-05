import { Controller, Get, Query } from '@nestjs/common';
import PaymentsService from './payments.service';
import Auth from '../auth/decorators/auth.decorator';
import PaginationDto from '../common/dto/pagination.dto';
import GetDataReqDecorator from '../auth/decorators/get-data-req.decorator';
import Enterprise from '../enterprise/entities/enterprise.entity';

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
}
