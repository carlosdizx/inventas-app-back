import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import CreateOauth2ClientDto from '../../src/auth/dto/create.oauth2-client.dto';
import PaginationDto from '../../src/common/dto/pagination.dto';
import OauthCrudService from '../../src/auth/oauth.crud.service';
import Oauth2Client from '../../src/auth/entities/oauth2.client.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('OauthCrudService', () => {
  let service: OauthCrudService;
  let repository: Repository<Oauth2Client>;

  const oauth2ClientToken: any | string = getRepositoryToken(Oauth2Client);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OauthCrudService,
        {
          provide: oauth2ClientToken,
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<OauthCrudService>(OauthCrudService);
    repository = module.get<Repository<Oauth2Client>>(oauth2ClientToken);
  });

  describe('createClient', () => {
    it('should create a new client', async () => {
      const dto = new CreateOauth2ClientDto();
      dto.businessName = 'Test Business Name';
      dto.email = 'test@example.com';

      const client = new Oauth2Client();
      client.businessName = dto.businessName;
      client.email = dto.email;
      client.clientId = 'test-client-id';
      client.clientSecret = 'test-client-secret';

      jest.spyOn(repository, 'create').mockReturnValue(client);
      jest.spyOn(repository, 'save').mockResolvedValue(client);

      const result = await service.createClient(dto);

      expect(result).toEqual(client);
    });
  });

  describe('listClients', () => {
    it('should list clients', async () => {
      const paginationDto = new PaginationDto();
      paginationDto.offset = 0;
      paginationDto.limit = 10;

      const clients = [
        new Oauth2Client(),
        new Oauth2Client(),
        new Oauth2Client(),
      ];

      jest.spyOn(repository, 'find').mockResolvedValue(clients);

      const result = await service.listClients(paginationDto);

      expect(result).toEqual(clients);
    });
  });
});
