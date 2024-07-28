import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseFilters,
} from '@nestjs/common';
import PaymentsService from './payments.service';
import CreatePaymentDto from './dto/create-payment.dto';
import Auth from '../users/decorators/auth.decorator';
import PaginationDto from '../common/dto/pagination.dto';
import GetDataReqDecorator from '../users/decorators/get-data-req.decorator';
import getDataReq from '../users/decorators/get-data-req.decorator';
import Enterprise from '../enterprise/entities/enterprise.entity';
import TypeormExceptionFilter from '../common/exceptions/typeorm.exception';
import { UserRoles } from '../users/enums/user.roles.enum';
import ChangeStatusDto from '../common/dto/change-status.dto';

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

  @Put('status/:id')
  @Auth(UserRoles.OWNER, UserRoles.CASHIER)
  public async changeStatusEnterprise(
    @Param('id', ParseUUIDPipe) id: string,
    @getDataReq() enterprise: Enterprise,
    @Body() dto: ChangeStatusDto,
  ) {
    return await this.paymentsService.changeStatus(id, enterprise, dto);
  }
}
