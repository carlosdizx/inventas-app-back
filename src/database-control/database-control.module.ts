import { Module } from '@nestjs/common';
import DatabaseControlService from './database-control.service';
import DatabaseControlController from './database-control.controller';

@Module({
  controllers: [DatabaseControlController],
  providers: [DatabaseControlService],
})
export default class DatabaseControlModule {}
