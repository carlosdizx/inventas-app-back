import { Global, Module } from '@nestjs/common';
import ErrorDatabaseService from './service/error.database.service';
import EncryptService from './service/encrypt.service';
import NodemailerService from './service/nodemailer.service';
import OtpService from './service/otp.service';

@Global()
@Module({
  providers: [
    ErrorDatabaseService,
    EncryptService,
    NodemailerService,
    OtpService,
  ],
  exports: [
    ErrorDatabaseService,
    EncryptService,
    NodemailerService,
    OtpService,
  ],
})
export default class CommonModule {}
