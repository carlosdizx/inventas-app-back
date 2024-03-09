import { Controller } from '@nestjs/common';
import DatabaseControlService from './database-control.service';

@Controller('database-control')
export default class DatabaseControlController {
  constructor(
    private readonly databaseControlService: DatabaseControlService,
  ) {}
}
