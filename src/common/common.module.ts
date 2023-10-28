import { Global, Module } from '@nestjs/common';
import ErrorDatabaseService from './util/error.database.service';

@Global()
@Module({
  providers: [ErrorDatabaseService],
  exports: [ErrorDatabaseService],
})
export default class CommonModule {}
