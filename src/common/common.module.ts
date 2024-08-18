import { Global, Module } from '@nestjs/common';
import ErrorDatabaseService from './service/error.database.service';
import EncryptService from './service/encrypt.service';
import NodemailerService from './service/nodemailer.service';

@Global()
@Module({
  providers: [ErrorDatabaseService, EncryptService, NodemailerService],
  exports: [ErrorDatabaseService, EncryptService, NodemailerService],
})
export default class CommonModule {}
