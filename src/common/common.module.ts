import { Global, Module } from '@nestjs/common';
import ErrorDatabaseService from './service/error.database.service';

@Global()
@Module({
  providers: [ErrorDatabaseService],
  exports: [ErrorDatabaseService],
})
export default class CommonModule {}
