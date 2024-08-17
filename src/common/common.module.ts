import { Global, Module } from '@nestjs/common';
import ErrorDatabaseService from './service/error.database.service';
import EncryptService from './service/encrypt.service';
import NodemailerService from './service/nodemailer.service';
import FirebaseService from './service/firebase.service';
import FirestoreService from './service/firestore.service';
import OtpService from './service/otp.service';

@Global()
@Module({
  providers: [
    ErrorDatabaseService,
    EncryptService,
    NodemailerService,
    FirebaseService,
    FirestoreService,
    OtpService,
  ],
  exports: [
    ErrorDatabaseService,
    EncryptService,
    NodemailerService,
    FirebaseService,
    FirestoreService,
    OtpService,
  ],
})
export default class CommonModule {}
