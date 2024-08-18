import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import UserAuthService from './user-auth.service';
import UserAuthController from './user-auth.controller';
import JwtStrategy from './strategies/jwt.strategy';
import getJwtConfig from '../common/config/jwt.config';
import User from './entities/user.entity';
import UserDetails from './entities/user.details.entity';
import UserCrudService from './user.crud.service';
import UserCrudController from './user.crud.controller';
import EnterpriseModule from '../enterprise/enterprise.module';
import UserOtp from './entities/user-otp.entity';

@Global()
@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User, UserDetails, UserOtp]),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getJwtConfig,
    }),
    EnterpriseModule,
  ],
  controllers: [UserAuthController, UserCrudController],
  providers: [JwtStrategy, UserAuthService, UserCrudService],
  exports: [
    TypeOrmModule,
    JwtStrategy,
    PassportModule,
    JwtModule,
    UserAuthService,
    UserCrudService,
  ],
})
export default class UserModule {}
