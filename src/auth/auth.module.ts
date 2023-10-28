import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import JwtStrategy from './strategies/jwt.strategy';
import Oauth2Client from './entities/oauth2.client.entity';
import getJwtConfig from '../common/jwt.config';
import OauthAuthorizerService from './oauth.authorizer.service';
import OauthCrudController from './oauth.crud.controller';
import OauthAuthorizerController from './oauth.authorizer.controller';
import OauthCrudService from './oauth.crud.service';

@Global()
@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Oauth2Client]),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getJwtConfig,
    }),
  ],
  controllers: [OauthCrudController, OauthAuthorizerController],
  providers: [OauthCrudService, OauthAuthorizerService, JwtStrategy],
  exports: [
    TypeOrmModule,
    OauthCrudService,
    OauthAuthorizerService,
    JwtStrategy,
    PassportModule,
    JwtModule,
  ],
})
export default class AuthModule {}
