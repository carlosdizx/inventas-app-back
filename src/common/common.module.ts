import { Global, Module } from '@nestjs/common';
import ErrorDatabaseService from './service/error.database.service';
import EncryptService from './service/encrypt.service';

@Global()
@Module({
  providers: [ErrorDatabaseService, EncryptService],
  exports: [ErrorDatabaseService, EncryptService],
})
export default class CommonModule {}
