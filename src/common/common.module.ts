import { Global, Module } from '@nestjs/common';
import ErrorDatabaseService from './service/error.database.service';
import EncryptService from './service/encrypt.service';
import NodemailerService from './service/nodemailer.service';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import FirebaseService from './service/firebase.service';
import FirestoreService from './service/firestore.service';
import OtpService from './service/otp.service';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        ttl: parseInt(configService.get('CACHE_TTL')),
      }),
    }),
  ],
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
