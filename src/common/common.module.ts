import { Global, Module } from '@nestjs/common';
import ErrorDatabaseService from './service/error.database.service';
import EncryptService from './service/encrypt.service';
import NodemailerService from './service/nodemailer.service';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';

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
  providers: [ErrorDatabaseService, EncryptService, NodemailerService],
  exports: [ErrorDatabaseService, EncryptService, NodemailerService],
})
export default class CommonModule {}
