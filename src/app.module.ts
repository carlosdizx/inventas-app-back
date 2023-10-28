import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import JoiValidation from './common/env.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import getTypeOrmConfig from './common/database.config';
import AuthModule from './auth/auth.module';
import CommonModule from './common/common.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: JoiValidation,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getTypeOrmConfig,
    }),
    CommonModule,
    AuthModule,
  ],
})
export default class AppModule {}
