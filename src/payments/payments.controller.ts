import { Controller } from '@nestjs/common';
import PaymentsService from './payments.service';

@Controller('payments')
export default class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}
}
