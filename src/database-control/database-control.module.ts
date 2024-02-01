import { Module } from '@nestjs/common';
import DatabaseControlService from './database-control.service';
import DatabaseControlController from './database-control.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Migration from './entities/migration.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Migration])],
  controllers: [DatabaseControlController],
  providers: [DatabaseControlService],
})
export default class DatabaseControlModule {}
