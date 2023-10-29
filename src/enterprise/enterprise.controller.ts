import { Controller } from '@nestjs/common';
import EnterpriseService from './enterprise.service';

@Controller('enterprise')
export default class EnterpriseController {
  constructor(private readonly enterpriseService: EnterpriseService) {}
}
