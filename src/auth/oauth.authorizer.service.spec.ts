import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import Oauth2Client from './entities/oauth2.client.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import OauthLoginDto from './dto/oauth.login.dto';
import OauthAuthorizerService from './oauth.authorizer.service';
import { Scopes } from './enums/scopes.enum';
import { NotFoundException } from '@nestjs/common';

describe('OauthAuthorizerService', () => {
  let service: OauthAuthorizerService;
  let repository: Repository<Oauth2Client>;
  let jwtService: JwtService;
  let configService: ConfigService;

  const oauth2ClientToken: string | any = getRepositoryToken(Oauth2Client);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OauthAuthorizerService,
        ConfigService,
        {
          provide: oauth2ClientToken,
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

    service = module.get<OauthAuthorizerService>(OauthAuthorizerService);
    repository = module.get<Repository<Oauth2Client>>(oauth2ClientToken);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('authenticateClient', () => {
    it('should authenticate a client and return an access token', async () => {
      const oauthLoginDto: OauthLoginDto = {
        clientSecret: 'valid-secret',
        clientId: 'valid-id',
        scope: Scopes.PAY_READ_LINK,
      };

      const oauth2Client = new Oauth2Client();
      oauth2Client.clientSecret = 'valid-secret';
      oauth2Client.clientId = 'valid-id';
      const jwtToken = 'valid-jwt-token';

      jest.spyOn(repository, 'findOneBy').mockResolvedValue(oauth2Client);
      jest.spyOn(jwtService, 'sign').mockReturnValue(jwtToken);

      const result = await service.authenticateClient(oauthLoginDto);

      expect(result).toEqual({ access_token: jwtToken });
    });

    it('should throw NotFoundException for a client that does not exist', async () => {
      const oauthLoginDto: OauthLoginDto = {
        clientSecret: 'valid-secret',
        clientId: 'non-existent-id',
        scope: Scopes.PAY_READ_LINK,
      };

      jest.spyOn(repository, 'findOneBy').mockResolvedValue(undefined);

      await expect(
        service.authenticateClient(oauthLoginDto),
      ).rejects.toThrowError(NotFoundException);
    });

    it('should throw NotFoundException for an incorrect clientSecret', async () => {
      const oauthLoginDto: OauthLoginDto = {
        clientSecret: 'invalid-secret',
        clientId: 'valid-id',
        scope: Scopes.COLLECT_WRITE_LINK,
      };

      const oauth2Client = new Oauth2Client();
      oauth2Client.clientSecret = 'valid-secret';
      oauth2Client.clientId = 'valid-id';

      jest.spyOn(repository, 'findOneBy').mockResolvedValue(oauth2Client);

      await expect(
        service.authenticateClient(oauthLoginDto),
      ).rejects.toThrowError(NotFoundException);
    });
  });
});
