import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import AuthService from './auth.service';
import AuthController from './auth.controller';
import JwtStrategy from './strategies/jwt.strategy';
import getJwtConfig from '../common/jwt.config';
import User from './entities/user.entity';
import UserDetails from './entities/user.details.entity';
import UserCrudService from './user.crud.service';
import UserCrudController from './user.crud.controller';

@Global()
@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User, UserDetails]),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getJwtConfig,
    }),
  ],
  controllers: [AuthController, UserCrudController],
  providers: [JwtStrategy, AuthService, UserCrudService],
  exports: [
    TypeOrmModule,
    JwtStrategy,
    PassportModule,
    JwtModule,
    AuthService,
    UserCrudService,
  ],
})
export default class AuthModule {}
