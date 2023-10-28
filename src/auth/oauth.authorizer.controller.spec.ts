import { Test, TestingModule } from '@nestjs/testing';
import OauthAuthorizerController from './oauth.authorizer.controller';
import OauthAuthorizerService from './oauth.authorizer.service';
import { Scopes } from './enums/scopes.enum';
import OauthBodyLoginDto from './dto/oauth.body.login.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import Oauth2Client from './entities/oauth2.client.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

describe('OauthAuthorizerController', () => {
  let controller: OauthAuthorizerController;
  let service: OauthAuthorizerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OauthAuthorizerController],
      providers: [
        OauthAuthorizerService,
        ConfigService,
        {
          provide: getRepositoryToken(Oauth2Client),
          useClass: Repository,
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<OauthAuthorizerController>(
      OauthAuthorizerController,
    );
    service = module.get<OauthAuthorizerService>(OauthAuthorizerService);
  });

  describe('', () => {
    it('should authorize with valid credentials', async () => {
      const authorizationHeader =
        'Basic ZTZiZTVmZDEwZjMwNDNiZWI0YzU4NjA1ZTQxNmIzZDM6NGZhZGZlZTBhOTAyNDQyYWE1ZGY0NjA0YmFjN2QwMWI=';
      const body = {
        scope: Scopes.PAY_WRITE_LINK,
      };

      const oauthLoginDto: OauthBodyLoginDto = {
        scope: body.scope,
        grant_type: 'client_credentials',
      };

      jest.spyOn(service, 'authenticateClient').mockResolvedValue({
        access_token: 'valid-token',
      });

      const result = await controller.authorize(
        authorizationHeader,
        oauthLoginDto,
      );

      expect(result).toEqual({ access_token: 'valid-token' });
    });

    it('should throw UnauthorizedException for missing authorization', async () => {
      const authorization = undefined;
      const scope = Scopes.COLLECT_READ_LINK;

      await expect(
        controller.authorize(authorization, {
          scope,
          grant_type: 'client_credentials',
        }),
      ).rejects.toThrowError(UnauthorizedException);
    });

    it('should throw UnauthorizedException for missing authorization', async () => {
      const authorization = 'Advance xdj88251AWFastAph';
      const scope = Scopes.COLLECT_READ_LINK;

      await expect(
        controller.authorize(authorization, {
          scope,
          grant_type: 'client_credentials',
        }),
      ).rejects.toThrowError(UnauthorizedException);
    });

    it('should throw UnauthorizedException for missing authorization', async () => {
      const authorization = 'Basic xdj88251AWFastAph';
      const scope = Scopes.PAY_WRITE_LINK;

      await expect(
        controller.authorize(authorization, {
          scope,
          grant_type: 'client_credentials',
        }),
      ).rejects.toThrowError(BadRequestException);
    });
  });
});
